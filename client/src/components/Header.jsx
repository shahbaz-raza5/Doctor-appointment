import React, { useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";


const Header = () => {
  const { user } = useSelector((state) => state.user);
  const { notification } = useSelector((state) => state.notification);
  const token = localStorage.getItem("token");
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
 
console.log(notification);


  return (
    <header className="bg-blue-700 p-1 shadow-bottom z-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link className="block text-teal-600" to="/">
              <span className="sr-only">Home</span>
              <div className="w-32 h-16">
                <img src="/logo4.png" alt="logo" />
              </div>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex">
                  <Link to="/notifications" className="hover:cursor-pointer">
                    <Badge
                      count={notification.length}
                      className="mr-3"
                      style={{
                        fontSize: "12px",
                        padding: "0 6px",
                        borderRadius: "10px",
                      }}
                    >
                      <div>
                        <div className="w-8 h-8 text-white pl-1 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="24px"
                            height="24px"
                          >
                            <path d="M12 2C10.34 2 9 3.34 9 5v2c-3.31 0-6 2.69-6 6v5l-2 2v1h20v-1l-2-2v-5c0-3.31-2.69-6-6-6V5c0-1.66-1.34-3-3-3zm0 20c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" />
                          </svg>
                        </div>
                      </div>
                    </Badge>
                  </Link>
                  <div className="text-white">{user.name}</div>
                </div>
              ) : (
                <div className="sm:flex sm:gap-4">
                  <div
                    className="relative"
                    onMouseEnter={() => setShowLoginDropdown(true)}
                    onMouseLeave={() => setShowLoginDropdown(false)}
                  >
                    <div className="block px-5 py-2 rounded-md bg-gradient-to-r from-teal-500 to-teal-500 text-white shadow cursor-pointer">
                      Login
                    </div>
                    {showLoginDropdown && (
                      <div
                        className="absolute right-0 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                      >
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <Link
                            to="/login/admin-login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Login as Admin
                          </Link>
                          <Link
                            to="/login/doctor-login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Login as Doctor
                          </Link>
                          <Link
                            to="/login/patient-login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Login as Patient
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="relative hidden sm:flex"
                    onMouseEnter={() => setShowSignupDropdown(true)}
                    onMouseLeave={() => setShowSignupDropdown(false)}
                  >
                    <div className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 cursor-pointer">
                      Signup
                    </div>
                    {showSignupDropdown && (
                      <div
                        className="absolute right-0 mt-10 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        onClick={(e) => e.stopPropagation()} 
                      >
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <Link
                            to="/signup/doctor-signup"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Signup as Doctor
                          </Link>
                          <Link
                            to="/signup/patient-signup"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Signup as Patient
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
