import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const NotificationCard = ({ notification, onMarkAsRead }) => {
    const { userName, createdAt, userId, postId } = notification;
    const timeDiff = moment(createdAt).fromNow();

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <img
                    src={userId.imageUrl}
                    alt={`${userId.displayName}'s profile`}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <Link to={`/home/posts/${postId}`}>
                        <p className="font-semibold">
                            {userName} has created a new post.
                        </p>
                    </Link>
                    <p className="text-sm text-gray-500">{timeDiff}</p>
                </div>
            </div>
            <div>
                <button
                    onClick={onMarkAsRead}
                    className="text-blue-secondary underline hover:text-blue-primary"
                >
                    Mark as read
                </button>
            </div>
        </div>
    );
};

export default NotificationCard;
