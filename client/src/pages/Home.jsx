import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DoctorCard, Layout } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { setDoctor } from "../features/slice/doctorSlice";
import { hideCompLoading, showCompLoading } from "../features/slice/alertSlice";
import DoctorDashboard from "../components/DoctorDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [doctorsAppointments, setDoctorsAppointments] = useState([]);


  const getDoctors = useCallback(async () => {
    try {
      dispatch(showCompLoading());
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideCompLoading());
      if (res.data.success) {
        dispatch(setDoctor(res.data.data));
        setDoctors(res.data.data);
      }
    } catch (error) {
      dispatch(hideCompLoading());
      console.log(error);
    }
  }, [user?.ispatient, user?.isAdmin]);


   const getMyAppointmentsForDoctor = async () => {
      try {
        dispatch(showCompLoading());
  
        const response = await axios.get(
          `/api/v1/doctor/all-appointment-doctor/${user._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        dispatch(hideCompLoading());
  
        const appointments = response.data.appointments;
        setDoctorsAppointments(appointments)
        appointments.forEach((appointment) => {
          if (!appointment.patientId) {
            console.warn("Missing patientId for appointment:", appointment);
          }
        });
  

      } catch (error) {
        dispatch(hideCompLoading());
        console.error(
          "Error fetching appointments:",
          error.response?.data || error.message
        );
      }
    };
  useEffect(() => {
    getDoctors();

    getMyAppointmentsForDoctor();
  }, [user]);
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.status?.toLowerCase() === "approved"
  ); 

  return (
    <>
      <Layout>
        {user?.ispatient && doctors.length > 0 && (
          <DoctorCard doctors={filteredDoctors} />
        )}
        {user?.isAdmin  && (
          <AdminDashboard doctors={doctors} approvedDoctor={filteredDoctors} />
        )}
         {user?.isdoctor && doctors.length > 0 && (
          <DoctorDashboard appointments={doctorsAppointments}/>
        )}
      </Layout>
    </>
  );
};

export default Home;
