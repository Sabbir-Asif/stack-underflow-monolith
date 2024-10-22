import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Authentication/AuthProvider';
import NotificationCard from './NotificationCard';
import { useOutletContext } from 'react-router-dom';

const NotificationList = () => {
    const { user } = useContext(AuthContext);
    const { notifications } = useOutletContext();  // Now notifications will be defined

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/notifications/${notificationId}/read`, {
                userId: user?._id
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-6 font-poppins">
            <h2 className='text-xl font-semibold'>Notifications:</h2>
            <hr className='bg-gray-300 h-0.5 mb-4 mt-1' />
            <span className='space-y-4'>
                {notifications && notifications.map(notification => (
                    <NotificationCard
                        key={notification._id}
                        notification={notification}
                        onMarkAsRead={() => handleMarkAsRead(notification._id)}
                    />
                ))}
            </span>
        </div>
    );
};

export default NotificationList;
