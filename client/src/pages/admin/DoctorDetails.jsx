import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { hideLoading, showLoading } from "../../features/slice/alertSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Layout } from "../../components";
const DoctorDetails = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { paramid } = useParams();

  const userId = user?._id;
  const [doctor, setDoctor] = useState([]);
  const id = paramid ? paramid : userId;

  const getAppointmentsForDoctor = async () => {
    try {
      const response = await axios.get(`/api/v1/doctor/all-appointment/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const appointments = response.data.appointments;

      // Validate data
      appointments.forEach((appointment) => {
        if (!appointment.patientId) {
          console.warn("Missing patientId for appointment:", appointment);
        }
      });
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    if (id) {
      getDoctorById();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      getAppointmentsForDoctor();
    }
  }, [id]);
  const getDoctorById = async () => {
    try {
      const res = await axios.get(`/api/v1/admin/getDoctorById/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setDoctor(res.data.doctor);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  const handleDoctorStatus = async (doctor, status) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/admin/handleDoctorStatus",
        {
          doctorId: doctor._id,
          userId: doctor.userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        setStatusApproved(true); 
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went Wrong");
    }
  };
  if (!doctor) return <div>Loading...</div>;
  return (
    <Layout>
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 p-8 rounded-md shadow-emerald-50 text-white">
          {doctor.firstName} {doctor.lastName}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-6 md:gap-1 mb-8">
          <div className="flex justify-center md:col-span-2">
            <img
              src={`http://localhost:8080${doctor.profileImage}`}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="rounded-lg shadow-lg object-cover w-56 h-56"
            />
          </div>

          {/* Doctor Information */}
          <div className="p-2 rounded-md shadow-sm flex flex-wrap md:col-span-4">
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Email</h2>
              <p className="text-gray-600">{doctor.email}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Phone</h2>
              <p className="text-gray-600">{doctor.phone}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">Gender</h2>
              <p className="text-gray-600">{doctor.gender}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">
                Specialization
              </h2>
              <p className="text-gray-600">{doctor.specialization}</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">
                Experience
              </h2>
              <p className="text-gray-600">{doctor.experience} Years</p>
            </div>
            <div className="w-44 mb-4">
              <h2 className="text-xl font-semibold text-teal-600">
                Qualifications
              </h2>
              <p className="text-gray-600">{doctor.qualifications}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-teal-600">
                License Number
              </h2>
              <p className="text-gray-600">{doctor.licenseNumber}</p>
            </div>

            <div>
              <div className="border-b-2 mb-4 mt-4"></div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-teal-600">Address</h2>
                <p className="text-gray-600">
                  {doctor.address}, {doctor.city}, {doctor.state}, {doctor.zip},{" "}
                  {doctor.country}
                </p>
              </div>
              <div className="border-b-2 mb-4 mt-4"></div>

              <div className="mb-4">
                <div className="flex justify-between">
                  <div className="mr-4">
                    <h2 className="text-lg font-semibold text-teal-600">
                      Total Patients
                    </h2>
                    <p className="text-gray-600">22</p>
                  </div>

                  <div className="mr-4">
                    <h2 className="text-lg font-semibold text-teal-600">
                      Booked Appointments
                    </h2>
                    <p className="text-gray-600">22</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-teal-600">
                      Closed Appointments
                    </h2>
                    <p className="text-gray-600">22</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-teal-600">
                      Pendings Appointments
                    </h2>
                    <p className="text-gray-600">22</p>
                  </div>
                </div>
              </div>

              <div className="border-b-2 mb-4 mt-4"></div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-teal-600">
                      Status
                    </h2>
                    <p className="text-gray-600">{doctor.status}</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-teal-600">
                      Created At
                    </h2>
                    <p className="text-gray-600">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-teal-600">
                      Updated At
                    </h2>
                    <p className="text-gray-600">
                      {new Date(doctor.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

             {user.ispatient && <div> Book appointment</div>} 
             
            {user.isAdmin && <div className="w-full flex justify-end pt-6">
                {doctor.status == "pending" && (
                  <button
                    onClick={() => handleDoctorStatus(doctor, "Approved")}
                    className="inline-block rounded bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 px-8 py-4 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Approve
                  </button>
                )}
                {doctor.status == "Approved" && (
                  <button className="inline-block rounded bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 px-8 py-4 text-xs font-medium text-white hover:bg-indigo-700">
                    Approved
                  </button>
                )}
                <button className="ml-5 inline-block rounded bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300 px-8 py-4 text-xs font-medium text-white hover:bg-indigo-700">
                  Cancel
                </button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetails;
