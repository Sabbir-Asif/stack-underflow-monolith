import React, { useContext, useState } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { AuthContext } from '../Authentication/AuthProvider';

const CreateNewPost = () => {
  const [question, setQuestion] = useState('');
  const [fileType, setFileType] = useState('javascript');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('write');
  const { user } = useContext(AuthContext);

  const fileTypes = [
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const fileName = `AS${timestamp}.${fileType}`;

    const postData = {
      question,
      fileType,
      fileContent,
      userId: user?._id,
      fileName,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/posts', postData);
      console.log('Response:', response.data);
      alert('File submitted successfully');
    } catch (error) {
      console.error('Error submitting file:', error);
      alert('Failed to submit file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-h-7xl overflow-scroll p-2 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Create post</h2>
      <hr className='h-0.5 bg-gray-300' />
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="mt-2 block text-md font-medium text-gray-600">
            Message:
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="1"
            className="w-full mt-1 p-2 border border-blue-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-blue-primary focus:border-blue-primary"
            required
          />
        </div>
        <div>
          <label className="text-md font-medium text-gray-600">
            File Type:
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full mt-1 p-2 border border-blue-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary"
            required
          >
            {fileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Input Type Selection: Write or Upload */}
        <div>
          <label className="text-md font-medium text-gray-600">Input Type:</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="write"
                checked={inputType === 'write'}
                onChange={() => setInputType('write')}
              />
              Write Content
            </label>
            <label>
              <input
                type="radio"
                value="upload"
                checked={inputType === 'upload'}
                onChange={() => setInputType('upload')}
              />
              Upload File
            </label>
          </div>
        </div>

        {/* Show File Content or File Uploader */}
        {inputType === 'write' ? (
          <div>
            <label className="block text-md font-medium text-gray-700">
              File Content:
            </label>
            <div className="mt-2 relative">
              <div
                className="code-editor-container"
                style={{
                  position: 'relative',
                  height: '350px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'scroll'
                }}
              >
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="code-input"
                  spellCheck="false"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    padding: '1rem',
                    border: 'none',
                    resize: 'none',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: 'white',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    zIndex: 1,
                    whiteSpace: 'pre',
                    overflowX: 'scroll',
                    outline: 'none'
                  }}
                />
                <pre
                  className="code-output"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    padding: '1rem',
                    margin: 0,
                    background: '#282a36',
                    color: '#f8f8f2',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    pointerEvents: 'none',
                    whiteSpace: 'pre',
                    overflowX: 'scroll'
                  }}
                >
                  <code
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        fileContent || '',
                        Prism.languages[fileType] || Prism.languages.javascript,
                        fileType
                      ),
                    }}
                  />
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-md font-medium text-gray-700">Upload File:</label>
            <input
              type="file"
              accept=".txt,.c,.cpp,.java,.js,.py,.go,.php,.rb"
              onChange={(e) => handleFileRead(e.target.files[0])}
              className="mt-2"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-secondary text-white py-3 rounded-md hover:bg-blue-primary transition duration-300"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full"></div>
        </div>
      )}

      <style jsx>{`
        /* Dracula Theme Colors */
        .code-editor-container {
          background-color: #282a36;
        }
        
        .code-input::selection {
          background-color: #44475a;
        }

        /* Custom scrollbar styles */
        .code-output::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .code-output::-webkit-scrollbar-track {
          background: #282a36;
        }

        .code-output::-webkit-scrollbar-thumb {
          background-color: #44475a;
          border-radius: 6px;
          border: 3px solid #282a36;
        }

        /* Syntax highlighting colors (Dracula theme) */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6272a4;
        }

        .token.punctuation {
          color: #f8f8f2;
        }

        .token.property,
        .token.tag,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #ff79c6;
        }

        .token.boolean,
        .token.number {
          color: #bd93f9;
        }

        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #50fa7b;
        }

        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string,
        .token.variable {
          color: #f8f8f2;
        }

        .token.atrule,
        .token.attr-value,
        .token.function,
        .token.class-name {
          color: #f1fa8c;
        }

        .token.keyword {
          color: #ff79c6;
        }

        .token.regex,
        .token.important {
          color: #ffb86c;
        }
      `}</style>
    </div>
  );
};

export default CreateNewPost;
