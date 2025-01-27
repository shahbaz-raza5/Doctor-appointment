import React from 'react';
import { Layout } from '../components';
import { useSelector } from 'react-redux';
import { FaUser } from "react-icons/fa";
const Profile = () => {
  const { user } = useSelector((state) => state.user);


  if (!user) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 p-8 rounded-md shadow-emerald-50 text-white">
          {user.name} 
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-6 md:gap-1 mb-8">
          <div className="flex justify-center md:col-span-2">
             <FaUser className="text-blue-500 text-2xl mr-4 w-44 h-44" />
          </div>


          <div className="p-2 rounded-md shadow-sm flex flex-wrap md:col-span-4">
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Email</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Phone</h2>
              <p className="text-gray-600">{user.phone}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Patient Id</h2>
              <p className="text-gray-600">{user.patientId}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Role</h2>
              <p className="text-gray-600">{user.isAdmin ? 'Admin' : 'User'}</p>
            </div>

           

            <div className="border-b-2 mb-4 mt-4"></div>

            <div className="w-full flex justify-end">
              <button className="inline-block rounded bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 px-8 py-4 text-xs font-medium text-white hover:bg-indigo-700">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
