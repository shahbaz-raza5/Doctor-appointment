import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, ReusableTable } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { hideCompLoading, showCompLoading } from "../../features/slice/alertSlice";
import { Pagination } from 'antd'; // Import Pagination component
import 'antd/dist/reset.css'; // Import Ant Design styles

const Patients = () => {
  const { user } = useSelector((state) => state.user);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useDispatch();
const id=user?._id;
const isdoctor=user?.isdoctor;
  useEffect(() => {
    if(isdoctor){
      getAllPatients();
    }else{
      getmyAllPatients()
    }
    
    
  }, [currentPage, pageSize]); // Fetch data when page or page size changes

  const getAllPatients = async () => {
    try {
      dispatch(showCompLoading());
      const res = await axios.get(`/api/v1/doctor/all-patients/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: currentPage,
          limit: pageSize,
        },
      });
      dispatch(hideCompLoading());
      if (res.data.success) {
        setPatients(res.data.data|| []);
        console.log(res.data.data);
         // Assume res.data.data.patients contains the patient data
        setTotalItems(res.data.data.totalCount); // Assume res.data.data.totalCount contains the total count
      }
    } catch (error) {
      dispatch(hideCompLoading());
      console.log(error);
    }
  };


  const getmyAllPatients = async () => {
    try {
      dispatch(showCompLoading());
      const res = await axios.get(`/api/v1/doctor/get-all-patients`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: currentPage,
          limit: pageSize,
        },
      });
      dispatch(hideCompLoading());
      if (res.data.success) {
        setPatients(res.data.data|| []);
        console.log(res.data.data);
         // Assume res.data.data.patients contains the patient data
        setTotalItems(res.data.data.totalCount); // Assume res.data.data.totalCount contains the total count
      }
    } catch (error) {
      dispatch(hideCompLoading());
      console.log(error);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const data = patients?.map((item) => ({
    patientName: item.details.patientName,
    patientId: item.details.patientId,
    dob: new Date(item.details.dob).toLocaleDateString(),
    appointmentDate: new Date(item.visitDate).toLocaleDateString(),
    timeSlot: item.details.timeSlot,
    // Add other fields if necessary
  }));
  const headers = [
    { label: "Patient Name", key: "patientName" },
    { label: "Patient ID", key: "patientId" },
    { label: "Date of Birth", key: "dob" },
    { label: "Appointment Date", key: "appointmentDate" },
    { label: "Time Slot", key: "timeSlot" },
    { label: "Actions", key: "actions" }
  ];

  const renderActions = (row) => (
    <Link to={`/doctor/patient-details/${row.patientId}`} className="text-blue-500 hover:underline">
      View Details
    </Link>
  );

  return (
    <Layout>
      <div className="p-8">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-4">Patients List</h2>
          <ReusableTable
            headers={headers}
            data={data}
            renderActions={renderActions}
          />
        </div>
        <div className="flex justify-center py-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false} // Optional: hide the page size changer
          />
        </div>
      </div>
    </Layout>
  );
};

export default Patients;
