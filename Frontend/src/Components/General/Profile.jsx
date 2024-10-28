import React, { useContext, useState } from 'react';
import axios from 'axios';
import { RiLogoutBoxRLine, RiLogoutBoxFill, RiLogoutBoxRFill } from "react-icons/ri";
import { AuthContext } from '../Authentication/AuthProvider';
import useAxiosSecure from '../../Hooks/UseAxiosSecure';

const Profile = ({ user, setUser, setIsDrawerOpen }) => {
    const axiosSecure = useAxiosSecure();

    const [newImageUrl, setNewImageUrl] = useState('');
    const { logOut } = useContext(AuthContext);

    const handleUpdateProfilePicture = async () => {
        if (!newImageUrl) return;

        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/users/${user._id}`, {
                displayName: user.displayName,
                email: user.email,
                imageUrl: newImageUrl,
            });
            setUser(response.data);
            setNewImageUrl('');
            alert('profile picture updated');
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    const handleLogout = () => {
        logOut();
        setIsDrawerOpen(false);
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-full font-poppins border pb-16">
            <button
                onClick={() => setIsDrawerOpen(false)}
                className="self-end text-gray-400 text-2xl hover:text-gray-600 mb-2"
            >
                &times;
            </button>
            <div className="shadow-lg w-full flex flex-col justify-center items-center border rounded-lg mb-6 py-3">
                <img
                    src={user.imageUrl || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="rounded-full w-28 h-28 mb-3 shadow-md border-2 border-blue-primary"
                />
                <div className="text-sm font-light mb-1 text-gray-700 italic">{user.email}</div>
                <div className="text-lg font-medium text-gray-600 mb-4">{user.displayName}</div>
            </div>
            <div className="w-full mb-4">
                <input
                    type="text"
                    placeholder="New Image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="input input-bordered text-sm h-10 w-full mb-2 px-3"
                />
                <button
                    onClick={handleUpdateProfilePicture}
                    className="btn-link text-blue-primary text-sm underline"
                >
                    Update Profile Picture
                </button>
            </div>
            <div className="flex justify-start w-full mt-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 mt-4 p-2 rounded-md hover:bg-error hover:text-cream-primary"
                >
                    <RiLogoutBoxRLine className='text-2xl' />
                    <span className='text-sm font-semibold'>
                        Log Out
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Profile;
