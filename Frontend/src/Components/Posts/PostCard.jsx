import React, { useContext, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { stackoverflowLight, stackoverflowDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { GoCodeReview } from "react-icons/go";
import moment from 'moment';
import { AuthContext } from '../Authentication/AuthProvider';
import axios from 'axios';

const PostCard = ({ post, setNewPost }) => {
    const { user } = useContext(AuthContext);
    const [showFullContent, setShowFullContent] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [theme, setTheme] = useState('light');
    const toggleContent = () => setShowFullContent(!showFullContent);
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    const truncatedText = (text, lines = 3) => {
        const linesArray = text.split('\n');
        return linesArray.length > lines ? linesArray.slice(0, lines).join('\n') : text;
    };

    const timeDiff = moment(post?.createdAt).fromNow();

    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/posts/${post._id}`);
            setNewPost(true);
            alert("Post deleted successfully");
        } catch (error) {
            console.error("Failed to delete post", error);
            alert("Failed to delete post");
        }
    };

    const viewCode = () => {
        const objUrl = `http://127.0.0.1:9000/stackunderflow/${post.fileName}`;
        window.open(objUrl, '_blank');
    };

    return (
        <div className="card w-full bg-base-100 shadow-md rounded-md border mb-4">
            <div className="card-body">
                <div className="flex items-center mb-2 justify-between">
                    <div className="flex items-center">
                        <img src={post.userId?.imageUrl} alt="" />
                        <div className="text-blue-primary font-poppins font-semibold mr-2">{post.userId.displayName}</div>
                        <div className="text-sm text-gray-500">{timeDiff}</div>
                    </div>
                    <div className="flex gap-1">
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
                        <div className="relative">
                            {
                                user?._id === post.userId._id ?
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="focus:outline-none">
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
                                            <circle cx="12" cy="12" r="2" />
                                            <circle cx="12" cy="19" r="2" />
                                            <circle cx="12" cy="5" r="2" />
                                        </svg>
                                    </button> : ""
                            }

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                                    <button
                                        onClick={handleDeletePost}
                                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2">
                                            <path d="M3 6h18M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M10 11v6M14 11v6" />
                                        </svg>
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
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

                <div className="mt-2 flex justify-between">
                    <button className="btn btn-link text-blue-primary p-0" onClick={toggleContent}>
                        {showFullContent ? 'See Less' : 'See More'}
                    </button>
                    <button className="btn btn-link text-blue-primary p-0" onClick={viewCode}>
                        <span className='flex gap-1'>
                            <GoCodeReview className='text-lg' />
                            <p>Download code</p>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;