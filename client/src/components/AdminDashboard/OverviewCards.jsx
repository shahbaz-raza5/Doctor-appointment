import React from "react";

const OverviewCards = ({ doctors, appointments }) => {
  const today = new Date().toISOString().split("T")[0];

  const todaysAppointments = appointments.filter(
    (app) => app.visitDate.split("T")[0] === today
  );

  const approvedDoctors = doctors.filter((doc) => doc.status === "Approved").length;
  const pendingDoctors = doctors.filter((doc) => doc.status === "Pending").length;

  const totalPatients = new Set(appointments.map((app) => app.patientId)).size;

  const stats = [
    { title: "Total Doctors", count: doctors.length },
    { title: "Approved Doctors", count: approvedDoctors },
    { title: "Pending Doctors", count: pendingDoctors },
    { title: "Total Patients", count: totalPatients },
    { title: "Appointments Today", count: todaysAppointments.length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 bg-white shadow rounded-lg text-center"
        >
          <h2 className="text-lg font-semibold">{stat.title}</h2>
          <p className="text-2xl font-bold">{stat.count}</p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
