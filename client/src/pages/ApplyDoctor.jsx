import React, { useState } from "react";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../features/slice/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import { message,Modal, Button  } from "antd";
import { useNavigate } from "react-router-dom";
import 'antd/dist/reset.css';
import axios from "axios";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const navigate=useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(true);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    doctorId: user?._id || "",
    firstName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: "",
    fees: "",
    experience: "",
    specialization: "",
    licenseNumber: "",
    qualifications: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    profileImage: null, 
    isdoctorstatus: "Applied",
  });

  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      formDataToSend.append("userId", user._id);

      const res = await axios.post(
        "/api/v1/doctor/apply-doctor",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };


  const handleOk = () => {
    setIsModalVisible(false);
    navigate('/')
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate('/')
  };

  return (
    <Layout>
      {user?.isdoctorstatus === "none" && (
        <div className="p-8" style={{ boxShadow: 'inset 0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleSubmit}>

            <div className="mb-8">
              <h2 className="md:w-[25%] text-white bg-gradient-to-r from-teal-400 to-blue-500 p-2 rounded-lg shadow-lg text-lg font-semibold mb-4">
                Personal Information
              </h2>

              <div className="flex flex-col md:flex-row md:space-x-4 md:mb-4">
                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  md:space-x-4 md:mb-4">
                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Gender
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        onChange={handleChange}
                        className="form-radio text-teal-500"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        onChange={handleChange}
                        className="form-radio text-teal-500"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        onChange={handleChange}
                        className="form-radio text-teal-500"
                      />
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>

                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Fees
                  </label>
                  <input
                    type="fees"
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your Fees"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col  md:space-x-4 md:mb-4">
              <h2 className="md:w-[25%] text-white bg-gradient-to-r from-teal-400 to-blue-500 p-2 rounded-lg shadow-lg text-lg font-semibold mb-4">
                Professional Information
              </h2>
              <div className="flex flex-col md:flex-row md:space-x-4 md:mb-4">

                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Experience (Years)
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="6-10">6-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select specialization</option>
                    <option value="General Practitioner">
                      General Practitioner
                    </option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your license number"
                    required
                  />
                </div>


                <div className="md:w-1/2 w-auto mb-3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your qualifications"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="md:w-[25%] text-white bg-gradient-to-r from-teal-400 to-blue-500 p-2 rounded-lg shadow-lg text-lg font-semibold mb-4">
                Address Information
              </h2>

              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your city"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mb-4">

                <div className="w-1/3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your state"
                    required
                  />
                </div>


                <div className="w-1/3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Zip
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your zip code"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your country"
                    required
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Submit Application
            </button>
          </form>
        </div>
      )}
      {user?.isdoctorstatus === "Applied" && (
         <Modal
         title="You have Already Applied!"
         open={isModalVisible}
         onOk={handleOk}
         onCancel={handleCancel}
       >
         <p>Your Listing request is pending, you'll get response with in 24 hours</p>
       </Modal>
      )}
      {user?.isdoctorstatus === "Approved" && (
          <Modal
          title="You Already Listed as a verified Doctor"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>As your Listing request is already been approved, you're not allow to apply again.</p>
        </Modal>
        
      )}
    </Layout>
  );
};

export default ApplyDoctor;
