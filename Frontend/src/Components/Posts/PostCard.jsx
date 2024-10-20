import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { stackoverflowLight, stackoverflowDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PostCard = ({ post }) => {
    const [showFullContent, setShowFullContent] = useState(false);
    const [theme, setTheme] = useState('light');

    const toggleContent = () => setShowFullContent(!showFullContent);
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    const truncatedText = (text, lines = 3) => {
        const linesArray = text.split('\n');
        return linesArray.length > lines ? linesArray.slice(0, lines).join('\n') : text;
    };

    return (
        <div className="card w-full bg-base-100 shadow-md rounded-md border mb-4">
            <div className="card-body">
                <div className="flex items-center mb-2 justify-between">
                    <div className="flex items-center">
                        <div className="text-blue-primary font-poppins font-semibold mr-2">{post.userId.displayName}</div>
                        <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="">
                        <label className="flex cursor-pointer gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <path
                                    d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                            </svg>
                            <input
                                type="checkbox"
                                className="toggle theme-controller"
                                onChange={toggleTheme}
                                checked={theme === 'dark'}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </label>
                    </div>
                </div>

                <div className="text-blue-secondary mb-2 font-poppins">
                    {showFullContent ? post.question : truncatedText(post.question)}
                </div>

                <div className="">
                    <SyntaxHighlighter
                        language={post.fileType}
                        style={theme === 'dark' ? stackoverflowDark : stackoverflowLight} 
                        wrapLines={true}
                        showLineNumbers={true}
                        className={'rounded-lg'}
                    >
                        {showFullContent ? post.fileContent : truncatedText(post.fileContent)}
                    </SyntaxHighlighter>
                </div>

                <div className="mt-2">
                    <button className="btn btn-link text-blue-primary p-0" onClick={toggleContent}>
                        {showFullContent ? 'See Less' : 'See More'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;