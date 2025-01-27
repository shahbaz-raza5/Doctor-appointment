import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideCompLoading, showCompLoading } from "../features/slice/alertSlice";
import { message } from "antd";
import { ReusableTable } from "../components";

const Appointments = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (user?.patientId) {
      getPatientAppointments();
    }
  }, [user?.patientId]);

  const getPatientAppointments = async () => {
    try {
      dispatch(showCompLoading());
      const response = await axios.get(
        `/api/v1/user/patient-appointments/${user?.patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideCompLoading());
      if (response.data.success) {
        setPatients(response.data.message);
      }
    } catch (error) {
      dispatch(hideCompLoading());
      console.error(error);
      message.error("Failed to fetch appointments.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // dispatch(showCompLoading());
      const response = await axios.delete(
        `/api/v1/user/delete-appointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // dispatch(hideCompLoading());
      if (response.data.success) {
        setPatients(patients.filter((patient) => patient._id !== id));
        message.success("Appointment deleted successfully.");
      } else {
        message.error("Failed to delete appointment.");
      }
    } catch (error) {
      // dispatch(hideCompLoading());
      console.error(error);
      message.error("Failed to delete appointment.");
    }
  };
  const data = patients.map((item) => ({
    patientId: item.patientId,
    fullName: item.fullName,
    appointmentDate: new Date(item.appointmentDate).toLocaleDateString(), 
    doctorName: item.doctorName,
    specialization: item.specialization,
    timeSlot: item.timeSlot,
  }));

  const headers = [
    { label: "Patient ID", key: "patientId" },
    { label: "Full Name", key: "fullName" },
    { label: "Appointment Date", key: "appointmentDate" },
    { label: "Doctor Name", key: "doctorName" },
    { label: "Specialization", key: "specialization" },
    { label: "Time Slot", key: "timeSlot" },
    { label: "Actions", key: "actions" }, 
  ];
  const renderActions = (row) => (
    <>
      {/* <button onClick={() => handleUpdate(row.patientId)}>Update</button> */}
      <button onClick={() => handleDelete(row.patientId)}>Delete</button>
    </>
  );
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>

        {data && (
          <ReusableTable headers={headers} data={data} renderActions={renderActions} />
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
