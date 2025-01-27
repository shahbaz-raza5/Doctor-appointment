import React, { useState,useCallback ,useEffect} from "react";
import { menuData, doctorMenu, adminMenu } from "../menuData/menuData";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { notification, Spin } from "antd";
import Search from "./Search";
import { FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios'
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const [notifications,setNotifications]=useState([])
  console.log('HEADER');
  
  


  const { comploading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderSearchComponent = () => {
    if (user?.ispatient) return <Search moduleType="patient" />;
    if (user?.isdoctor) return <Search moduleType="doctor" />;
    if (user?.isadmin) return <Search moduleType="admin" />;
    return null;
  };

  const sideBarMenu = user?.ispatient
    ? menuData
    : user?.isdoctor
    ? doctorMenu
    : adminMenu;

  return (
    <div className="w-full  grid grid-cols-12 sm:grid-cols-12">
      <div className=" bg-gradient-to-r from-teal-200 to-blue-400 col-span-1 sm:col-span-2">
        <div >
          <div className="flex justify-center border-b-2 bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 border-blue-500 border-opacity-25 h-[90px]">
          </div>

          <div className="flex-1 h-full hidden md:block bg-blue-800 ">
            {sideBarMenu?.map((menu) => (
              <Link
                to={menu.path}
                className={`border-b-2 border-blue-600 border-opacity-25 transition-all duration-300 p-[10px] text-gray-50  flex justify-center items-center h-16 hover:cursor-pointer ${
                  location.pathname === menu.path
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white drop-shadow-lg"
                    : "bg-gradient-to-r from-teal-200 to-blue-400 "
                }`}
                key={menu.name}
              >
                <div className="w-16 flex justify-center">
                  <img className="w-8 h-8" src={menu.icon} alt={menu.name} />
                </div>
                <div className="w-24 flex justify-start font-semibold text-lg items-start">
                  {menu.name}
                </div>
              </Link>
            ))}
            <div
              className="bg-gradient-to-r from-teal-200 to-blue-400 border-b-2 border-blue-600 border-opacity-25 transition-all duration-300 p-8 font-semibold text-lg text-gray-50  flex justify-center items-center h-12 hover:cursor-pointer"
              onClick={handleLogout}
            >
            <FaSignOutAlt color="black" style={{ width: "30px", height: "30px", marginLeft:'-20px', marginRight:'20px' }} /> Logout
            </div>
            <div
              className="bg-gradient-to-r from-teal-200 to-blue-400  border-blue-600 border-opacity-25 transition-all duration-300 p-8 font-semibold text-lg text-gray-50  flex justify-center items-center h-28 hover:cursor-pointer"
             
            >
             
            </div>
          </div>

          <div className="h-[calc(100vh-120px)] md:hidden block  border-r-2 border-b-2 border-blue-600 border-opacity-25 ">
            {sideBarMenu?.map((menu) => (
              <Link
                to={menu.path}
                className={`border-b-2 border-blue-600 border-opacity-25 transition-all duration-300 p-[10px] text-gray-50 flex justify-center items-center h-16 hover:cursor-pointer ${
                  location.pathname === menu.path
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white drop-shadow-lg"
                    : "bg-gradient-to-r from-teal-200 to-blue-400 "
                }`}
                key={menu.name}
              >
                <div className="w-16 flex justify-center">
                  <img className="w-8 h-8" src={menu.icon} alt={menu.name} />
                </div>
              </Link>
            ))}

            <div>
              <div className=" w-16 flex justify-center bg-gradient-to-r from-teal-200 to-blue-400 border-blue-600 border-opacity-25 transition-all font-semibold text-lg text-gray-50" onClick={handleLogout}>
                <FaSignOutAlt />
              </div>
            
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-11 sm:col-span-10">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 h-[90px]  border-b-2 border-blue-500 border-opacity-25 flex justify-end items-center">
          {renderSearchComponent()}
        </div>

            

        {comploading ? (
          <div className=" flex justify-center mt-5 md:z-50">
            <Spin />
          </div>
        ) : (
          <div className="" style={{ boxShadow: 'inset 0 4px 6px rgba(0, 0, 0, 0.1)' }}>{children}</div>
        )}
      </div>
    </div>
  );
};

export default Layout;
