import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import VerifiedIcon from '@mui/icons-material/Verified';
const DoctorCard = ({ doctors }) => {

  const formatDate = useMemo(() => (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; 
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const daySuffix = getDaySuffix(day);

    return `${day}${daySuffix} ${month}, ${year}`;
  }, []);

  return (
    <div className="flex flex-wrap justify-evenly">
      {doctors?.map((doctor) => (
        <div key={doctor._id} className="w-80 my-5">
          <div className="relative block overflow-hidden rounded-lg border bg-blue-100 border-gray-100 p-4 sm:p-6 lg:p-8">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

            <div className="sm:flex sm:justify-between sm:gap-4">
            
              <div>
                <div className="flex ">
                {doctor?.status==='Approved' && <VerifiedIcon style={{ color: "blue" }} />}
                <h1 className="text-xl font-bold ml-2 text-gray-900 sm:text-xl">
                  {`${doctor.firstName}`}
                </h1>
                </div>
              

                <h2 className="mt-1 text-l font-medium text-gray-600">
                  {doctor.specialization}
                </h2>
              </div>

              <div className="hidden sm:block sm:shrink-0">
                <img
                  src={`http://localhost:8080${doctor.profileImage}`}
                  alt={`${doctor.firstName}`}
                  className="size-16 rounded-lg object-cover shadow-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-pretty text-sm text-gray-500">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
                velit illum provident a, ipsa maiores deleniti consectetur nobis
                et eaque.
              </p>
            </div>

            <div className="mt-6 flex gap-4 sm:gap-6">
              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-600">Published</dt>
                <dd className="text-xs text-gray-500">
                  {formatDate(doctor.updatedAt)}
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-600">
                  Experience
                </dt>
                <dd className="text-xs text-gray-500">
                  {doctor.experience} years
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-600">
                  Appointment
                </dt>
                <dd className="text-xs text-gray-500">
                  {doctor.experience} years
                </dd>
              </div>
            </div>

           <div className="flex justify-between w-full mt-6">
              <div className="">
                <Link
                  to={`/user/book-appointment/${
                    doctor?.userId
                  }?firstName=${encodeURIComponent(
                    doctor?.firstName
                  )}&lastName=${encodeURIComponent(
                    doctor?.lastName
                  )}&specialization=${encodeURIComponent(
                    doctor?.specialization
                  )}`}
                  className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 mt-12 px-4 rounded-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Book Appointment
                </Link>
              </div>
            
            
              <div >
                <Link
                  to={`/admin/doctor-details/${doctor?.userId}`}
                  className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 mt-12 px-4 rounded-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  View
                </Link>
              </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorCard;
