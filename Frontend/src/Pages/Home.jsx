import React, { useState } from 'react';
import SecondaryNavbar from '../Components/General/SecondaryNavbar';
import { Outlet } from 'react-router-dom';

const Home = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <div>
            <span className='flex justify-center mt-6'>
                <SecondaryNavbar
                    notifications={notifications}
                    setNotifications={setNotifications}
                    setLoading={setLoading}
                />
            </span>
            <Outlet context={{ notifications }} />
        </div>
    );
};

export default Home;
