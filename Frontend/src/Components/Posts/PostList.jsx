import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/posts?page=${page}&limit=10`);
            setPosts(res.data.data.posts);
            setPagination(res.data.data.pagination);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchPosts(pageNumber);
    };

    return (
        <div className="container max-w-5xl mx-auto px-4 py-6">
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div>
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}

                    <div className="flex justify-center mt-4">
                        <div className="btn-group space-x-2">
                            <button
                                className="text-blue-primary underline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            {[...Array(pagination.totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`btn bg-blue-secondary text-white py-0 h-1 ${currentPage === index + 1 ? 'btn-active' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className="text-blue-secondary underline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostList;
