import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import {
  hideCompLoading,
  showCompLoading,
} from "../../features/slice/alertSlice";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaTimes } from "react-icons/fa";
import { Pagination } from "antd";
import "antd/dist/reset.css";
import ReusableTable from "../../components/ReusableTable";

const AllAppointments = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [doneAppointments, setDoneAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [status, setStatus] = useState("upcoming");
  const isadmin = user?.isAdmin;
  useEffect(() => {
    if (isadmin) {
      getAllAppointmentsForDoctor(status);
    } else {
      getAppointmentsForDoctor(status);
      getMyAppointmentsForDoctor();
    }
  }, [status, currentPage, pageSize]);
console.log('Upcomimg APointments',upcomingAppointments);
console.log('doneAppointments',doneAppointments);
console.log('cancelledAppointments',cancelledAppointments);

  const getAppointmentsForDoctor = async (status) => {
    try {
      dispatch(showCompLoading());

      const response = await axios.get(
        `/api/v1/doctor/all-appointments/${user._id}?page=${currentPage}&pageSize=${pageSize}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(hideCompLoading());

      const appointments = response.data.appointments;
      console.log('APPO',appointments);

      // Validate data
      appointments.forEach((appointment) => {
        if (!appointment.patientId) {
          console.warn("Missing patientId for appointment:", appointment);
        }
      });

      switch (status) {
        case "upcoming":
          setUpcomingAppointments(appointments);
          break;
        case "done":
          setDoneAppointments(appointments);
          break;
        case "cancelled":
          setCancelledAppointments(appointments);
          break;
        default:
          break;
      }

      setTotalItems(response.data.totalCount);
    } catch (error) {
      dispatch(hideCompLoading());
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
    }
  };

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
      console.log('APPOINTMENT ALL DOC',appointments);

      // Validate data
      appointments.forEach((appointment) => {
        if (!appointment.patientId) {
          console.warn("Missing patientId for appointment:", appointment);
        }
      });

     

      // setTotalItems(response.data.totalCount);
    } catch (error) {
      dispatch(hideCompLoading());
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
    }
  };


  const getAllAppointmentsForDoctor = async (status) => {
    try {
      dispatch(showCompLoading());

      const response = await axios.get(
        `/api/v1/doctor/get-all-appointments?page=${currentPage}&pageSize=${pageSize}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(hideCompLoading());

      const appointments = response.data.appointments;
      // console.log(appointments);

      // Validate data
      appointments.forEach((appointment) => {
        if (!appointment.patientId) {
          console.warn("Missing patientId for appointment:", appointment);
        }
      });

      switch (status) {
        case "upcoming":
          setUpcomingAppointments(appointments);
          break;
        case "done":
          setDoneAppointments(appointments);
          break;
        case "cancelled":
          setCancelledAppointments(appointments);
          break;
        default:
          break;
      }

      setTotalItems(response.data.totalCount);
    } catch (error) {
      dispatch(hideCompLoading());
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    console.log(
      `Changing status for appointment ${appointmentId} to ${newStatus}`
    );
    try {
      dispatch(showCompLoading());
      await axios.put(
        `/api/v1/doctor/update-appointment-status/${appointmentId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideCompLoading());
      getAppointmentsForDoctor(status);
    } catch (error) {
      dispatch(hideCompLoading());
      console.error(
        "Error updating appointment status:",
        error.response?.data || error.message
      );
    }
  };

  let headers = [
    { label: "Mark done", key: "checkbox" },
    { label: "Patient Name", key: "fullName" },
    { label: "Patient Id", key: "patientId" },
    { label: "Contact No.", key: "phoneNumber" },
    { label: "DOB", key: "dateOfBirth" },
    { label: "Apt Date", key: "appointmentDate" },
    { label: "Time Slot", key: "timeSlot" },
    { label: "Reason", key: "reasonForVisit" },
    { label: "Actions", key: "actions" },
    { label: "Cancel", key: "cancel" },
  ];
  headers = user.isAdmin
    ? headers.filter(
        (header) => !["checkbox", "actions", "cancel"].includes(header.key)
      )
    : headers;

  const headersWithoutCancel = [
    { label: "Patient Name", key: "fullName" },
    { label: "Contact No.", key: "phoneNumber" },
    { label: "Date Of Birth", key: "dateOfBirth" },
    { label: "Appointment Date", key: "appointmentDate" },
    { label: "Time Slot", key: "timeSlot" },
    { label: "Reason For Visit", key: "reasonForVisit" },
  ];

  const renderActions = (appointment, index) => {
    // console.log("renderActions INDEX", index);
    // console.log("renderActions APPOINTMENTS", appointment);
    // console.log("renderActions PATIENT ID", appointment.patientId);

    return (
      <div className=" flex  justify-evenly">
        <Link
          to={`/doctor/patient-form/${appointment.patientId}/${appointment.index}`}
          title="Add Checkup Details"
        >
          <FaPlus className="h-5 w-5" />
        </Link>
        <Link
          to={`/doctor/patient-details/${appointment.patientId}`}
          title="View Patient Details"
        >
          <FaEye className="h-5 w-5" />
        </Link>
      </div>
    );
  };

  const renderCancel = (appointment) => (
    <button
      onClick={() =>
        handleAppointmentStatusChange(appointment._id, "cancelled")
      }
      title="Cancel"
    >
      <FaTimes className="h-5 w-5" />
    </button>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  const mapAppointmentsData = (appointments) =>
    appointments.map((appointment, index) => ({
      index: index,
      checkbox: (
        <input
          type="checkbox"
          onChange={() =>
            handleAppointmentStatusChange(appointment?._id, "done")
          }
        />
      ),
      fullName: appointment?.fullName || "Unknown",
      patientId: appointment?.patientId || "Unknown",
      phoneNumber: appointment?.phoneNumber || "N/A",
      dateOfBirth: formatDate(appointment?.dateOfBirth),
      appointmentDate: formatDate(appointment?.appointmentDate),
      timeSlot: appointment?.timeSlot || "Not Specified",
      reasonForVisit: (
        <div
          title={appointment?.reasonForVisit}
          className="truncate"
          style={{ maxWidth: "150px" }}
        >
          {appointment?.reasonForVisit || "No Reason Provided"}
        </div>
      ),
      actions: renderActions(appointment, index),
      cancel: activeTab === "upcoming" ? renderCancel(appointment) : null,
    }));

  return (
    <Layout>
      <ul
        className="mb-5 flex list-none flex-row flex-wrap border-b-0"
        role="tablist"
      >
        <li role="presentation">
          <a
            href="#upcoming"
            className={`my-2 block border-x-0 border-b-2 border-t-0 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight hover:bg-zinc-100 focus:outline-none ${
              activeTab === "upcoming"
                ? "border-primary border-blue-400 text-primary"
                : "border-transparent text-neutral-500"
            }`}
            role="tab"
            aria-controls="upcoming"
            aria-selected={activeTab === "upcoming"}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab("upcoming");
              setStatus("upcoming");
            }}
          >
            Upcoming Appointments
          </a>
        </li>
        <li role="presentation">
          <a
            href="#done"
            className={`my-2 block border-x-0 border-b-2 border-t-0 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight hover:bg-zinc-100 focus:outline-none ${
              activeTab === "done"
                ? "border-primary text-primary border-blue-400"
                : "border-transparent text-neutral-500"
            }`}
            role="tab"
            aria-controls="done"
            aria-selected={activeTab === "done"}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab("done");
              setStatus("done");
            }}
          >
            Done Appointments
          </a>
        </li>
        <li role="presentation">
          <a
            href="#cancelled"
            className={`my-2 block border-x-0 border-b-2 border-t-0 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight hover:bg-zinc-100 focus:outline-none ${
              activeTab === "cancelled"
                ? "border-primary text-primary border-blue-400"
                : "border-transparent text-neutral-500"
            }`}
            role="tab"
            aria-controls="cancelled"
            aria-selected={activeTab === "cancelled"}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab("cancelled");
              setStatus("cancelled");
            }}
          >
            Cancelled Appointments
          </a>
        </li>
      </ul>

      <div className="mb-5 px-5">
        {activeTab === "upcoming" && (
          <ReusableTable
            headers={headers}
            data={mapAppointmentsData(upcomingAppointments)}
            renderActions={renderActions}
          />
        )}
        {activeTab === "done" && (
          <ReusableTable
            headers={headersWithoutCancel}
            data={mapAppointmentsData(doneAppointments)}
          />
        )}
        {activeTab === "cancelled" && (
          <ReusableTable
            headers={headersWithoutCancel}
            data={mapAppointmentsData(cancelledAppointments)}
          />
        )}
      </div>

      <div className="flex justify-center py-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </Layout>
  );
};

export default AllAppointments;
