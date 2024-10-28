import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { TbStackBack } from "react-icons/tb";
import { AuthContext } from "../Authentication/AuthProvider";
import Profile from "./Profile";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logOut, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logOut()
        .then(() => {
          window.location.reload();
        })
        .catch((error) => console.error(error));
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className="relative font-poppins">
      <div className="navbar bg-blue-secondary font-manrope md:px-6">
        <div className="navbar-start">
          <NavLink to={"/home/posts"}>
            <span className="flex items-center gap-1">
              <TbStackBack className="text-5xl text-base-200" />
              <h2 className="text-lg text-white md:text-xl font-medium italic font-poppins">
                Stack-Underflow
              </h2>
            </span>
          </NavLink>
        </div>
        
        <div className="navbar-end gap-1 md:gap-4">
          {user ? (
            <div className="relative">
              <button
                className="text-md mr-2 text-white font-poppins border-2 border-blue-primary rounded-full p-1"
                onClick={() => setIsDrawerOpen(true)}
              >
                <img
                  src={user.imageUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="rounded-full w-10 h-10"
                />
              </button>

              {isDrawerOpen && (
                <div className="fixed top-20 right-2 w-80 shadow-lg z-50">
                  <Profile user={user} setUser={setUser} setIsDrawerOpen={setIsDrawerOpen} />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="border px-3 rounded-full text-md italic text-white font-poppins"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
