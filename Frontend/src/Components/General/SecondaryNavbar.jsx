import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiFillHome, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { AuthContext } from '../Authentication/AuthProvider';
import { io } from 'socket.io-client';
import axios from 'axios';

const SecondaryNavbar = ({ notifications, setNotifications, setLoading }) => {
    
    const [notificationLength, setNotificationLength] = useState(0);
    const { user } = useContext(AuthContext);

    const fetchNotifications = async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/v1/notifications');

            const filteredNotifications = res.data.filter(notification =>
                notification.userId._id !== user?._id && !notification.read.includes(user?._id)
            );

            setNotifications(filteredNotifications);
            console.log("nav", notifications);
            setNotificationLength(filteredNotifications.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const socket = io('http://localhost:8080');

        if (user) {
            fetchNotifications();

            socket.on('new-notification', (newNotification) => {
                // if (
                //     newNotification.userId._id !== user._id &&
                //     !newNotification.read.includes(user._id)
                // ) {
                //     setNotifications((prev) => [newNotification, ...prev]);
                //     setNotificationLength(prev => prev + 1);
                // }
                fetchNotifications();
            });
        }

        return () => {
            socket.disconnect();
        };
    }, [user]);

    return (
        <div>
            <ul className="menu lg:menu-horizontal rounded-box space-x-4 px-6">
                <li>
                    <NavLink
                        to="/home/posts"
                        className={({ isActive }) =>
                            isActive
                                ? 'rounded-none border-b-2 border-blue-primary text-blue-primary'
                                : 'text-gray-500 rounded-none'
                        }
                    >
                        {({ isActive }) =>
                            isActive ? (
                                <AiFillHome className='h-8 w-8' />
                            ) : (
                                <AiOutlineHome className='h-8 w-8' />
                            )
                        }
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/home/notifications"
                        className={({ isActive }) =>
                            isActive
                                ? 'border-b-2 rounded-none border-blue-primary text-blue-primary'
                                : 'text-gray-500'
                        }
                    >
                        {({ isActive }) =>
                            <>
                                {isActive ? (
                                    <AiFillBell className='h-8 w-8' />
                                ) : (
                                    <AiOutlineBell className='h-8 w-8 relative' />
                                )}
                                {notificationLength > 0 && (
                                    <span className="absolute -mt-5 -mr-0.5 bg-red-500 p-1 badge text-base-200">
                                        {notificationLength}
                                    </span>
                                )}
                            </>
                        }
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default SecondaryNavbar;
