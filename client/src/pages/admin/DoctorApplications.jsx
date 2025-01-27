import React from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { ReusableTable } from "../../components";

const DoctorApplications = () => {
  const { doctor } = useSelector((state) => state.doctor);

const data = doctor?.map((item) => ({
  doctorName: `${item.firstName} ${item.lastName}`,
  specialization: item.specialization,
  experience: item.experience,
  status: item.status,
  userId:item.userId
}));
  const headers = [
    { label: "Doctor Name", key: "doctorName" },
    { label: "Specialization", key: "specialization" },
    { label: "Experience", key: "experience" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" }
  ];

  const renderActions = (row) => (
    <Link
    to={`/admin/doctor-details/${row.userId}`} // Use Link to navigate
    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
  >
    View
  </Link>
  );
  return (
    <Layout>
      <div className="p-8">
        <ReusableTable headers={headers} data={data} renderActions={renderActions}/>
      </div>
    </Layout>
  );
};

export default DoctorApplications;
