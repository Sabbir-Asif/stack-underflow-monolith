import { useContext, useState } from "react";
import Navbar from "../Components/General/Navbar";
import CreateNewPost from "../Components/Posts/CreateNewPost";
import { AuthContext } from "../Components/Authentication/AuthProvider";
import PostList from "../Components/Posts/PostList";

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    // console.log(imageUrl);
    return (
        <div>
            <Navbar />
            <section className="max-w-4xl mt-16 mx-auto font-poppins shadow-md border rounded-lg py-2">
                <div className="flex items-center">
                    <div className="">
                        {user && <img src={user.imageUrl} alt="User Image"
                            className="w-16"
                        />}
                    </div>
                    <button className="bg-base-300 py-2 flex-grow px-6 mr-12 rounded-full text-gray-500 text-left font-light" onClick={() => document.getElementById('my_modal_3').showModal()}>Create a post, {user?.displayName}</button>
                    <dialog id="my_modal_3" className="modal modal-middle modal-scroll">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <CreateNewPost />
                        </div>
                    </dialog>
                </div>
            </section>
            <section>
                <PostList />
            </section>
        </div>
    );
};

export default LandingPage;