import React, { useContext, useState } from 'react';
import CreateNewPost from '../Posts/CreateNewPost';
import PostList from '../Posts/PostList';
import { AuthContext } from '../Authentication/AuthProvider';

const PostPage = () => {

    const { user } = useContext(AuthContext);
    const [newPost, setNewPost] = useState(false);
    return (
        <div>
            <section className="max-w-4xl mt-6 mx-auto font-poppins shadow-md border rounded-lg py-2 mb-4">
                <div className="flex items-center">
                    <div className="">
                        {user && <img src={user.imageUrl} alt="User Image"
                            className="w-12 h-12 rounded-full mx-2"
                        />}
                    </div>
                    <button className="bg-base-300 py-2 flex-grow px-6 mr-12 rounded-full text-gray-500 text-left font-light" onClick={() => document.getElementById('my_modal_3').showModal()}>Create a post, {user?.displayName}</button>
                    <dialog id="my_modal_3" className="modal modal-middle modal-scroll">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <CreateNewPost setNewPost={setNewPost} />
                        </div>
                    </dialog>
                </div>
            </section>
            <section className='max-h-[670px] overflow-scroll'>
                <PostList newPost={newPost} setNewPost={setNewPost} />
            </section>
        </div>
    );
};

export default PostPage;