import { useContext, useState } from "react";
import Navbar from "../Components/General/Navbar";
import { AuthContext } from "../Components/Authentication/AuthProvider";
import { Outlet } from "react-router-dom";

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    // console.log(imageUrl);
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default LandingPage;