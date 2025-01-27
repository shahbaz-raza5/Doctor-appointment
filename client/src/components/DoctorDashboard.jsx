import React from "react";
import { FaUser } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DoctorDashboard = ({ appointments }) => {
  const statusCounts = appointments.reduce(
    (acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    },
    { cancel: 0, done: 0, upcoming: 0 }
  );

  return (
    <div className="bg-blue-200 w-full h-full  p-4 flex flex-col">
      <div className="flex justify-between mb-4">
      <div className="w-[19%] h-48 bg-blue-400 rounded-lg flex flex-col justify-center items-center text-white">
          <span className="font-bold text-4xl">{appointments?.length}</span>
          <span className="font-medium">Total Appointments</span>
        </div>
        <div className="w-[19%] h-48 bg-green-500 rounded-lg flex flex-col justify-center items-center text-white">
          <span className="font-bold text-4xl">10</span>
          <span className="font-medium">Total Patients</span>
        </div>
        <div className="w-[19%] h-48 bg-green-700 rounded-lg flex flex-col justify-center items-center text-white">
          <span className="font-bold text-4xl">{statusCounts.done}</span>
          <span className="font-medium">Done Appointments</span>
        </div>
        <div className="w-[19%] h-48 bg-yellow-500 rounded-lg flex flex-col justify-center items-center text-white">
          <span className="font-bold text-4xl">{statusCounts.upcoming}</span>
          <span className="font-medium">Upcoming Appointments</span>
        </div>
        <div className="w-[19%] h-48 bg-gray-400 rounded-lg flex flex-col justify-center items-center text-white">
          <span className="font-bold text-4xl">{statusCounts.cancel}</span>
          <span className="font-medium">Cancelled Appointments</span>
        </div>
     
      </div>

      <div className="flex">
        <div className="flex-col w-[49%] pr-4">
          <div className="w-full h-auto bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Upcoming Patients
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {appointments
                .filter((appointment) => appointment.status === "upcoming")
                .map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <FaUser className="text-blue-500 text-2xl mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {appointment.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Reason: {appointment.reasonForVisit}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {appointments.filter(
              (appointment) => appointment.status === "upcoming"
            ).length === 0 && (
              <p className="text-gray-500 text-center mt-4">
                No upcoming patients at the moment.
              </p>
            )}
          </div>
        </div>

        <div className="w-[49%] flex flex-col">
          <div className="w-full bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Current Date</h2>
            <Calendar className="react-calendar-custom" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
