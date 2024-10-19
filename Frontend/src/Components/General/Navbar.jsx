import { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GrAnnounce } from "react-icons/gr";
import { FaServicestack } from "react-icons/fa6";
import { AuthContext } from "../Authentication/AuthProvider";

const Navbar = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = () => {
    setIsPopupVisible(false);
  };

  const handleReportClick = () => {
    setIsPopupVisible(true);
  };

  const handleAuthClick = () => {
    if (user) {
      logOut()
        .then(() => {
          navigate("/");
        })
        .catch((error) => console.error(error));
    } else {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const links = (
    <>
      {/* <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-black btn bg-inherit border-black shadow-none hover:bg-[#002b47] hover:text-black font-semibold text-lg"
              : ""
          }
        >
          Home
        </NavLink>
      </li> */}
    </>
  );

  return (
    <div className="relative font-poppins">
      <div className="navbar bg-blue-secondary font-manrope md:px-6">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content text-base-200 font-semibold bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow items-center text-lg"
            >
              {links}
            </ul>
          </div>
          <NavLink to={"/"}>
            <span className="flex items-center gap-1">
              <FaServicestack className="text-5xl text-base-200" />
              <h2 className="text-lg text-white md:text-3xl font-bold font-poppins">
                Stack-Underflow
              </h2>
            </span>
          </NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal text-base-200 font-semibold gap-6 items-center text-lg px-1">
            {links}
          </ul>
        </div>
        <div className="navbar-end gap-1 md:gap-4">
          <div>
            <button
              onClick={handleAuthClick}
              className="btn btn-outline text-base-200 text-lg"
            >
              {user ? "Log Out" : "Sign In"}
            </button>
            {user && (
              <span className="text-sm ml-2 text-white font-poppins">{user.displayName}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;