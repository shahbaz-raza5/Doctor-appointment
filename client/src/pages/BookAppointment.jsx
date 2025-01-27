import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "../components";
import { useParams,useLocation,useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";

const BookAppointment = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  const { id} = useParams();
  const location = useLocation();
  const navigate=useNavigate()
  // Function to get query parameters from URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      firstName: params.get('firstName') || '',
      lastName: params.get('lastName') || '',
      specialization: params.get('specialization') || '',
    };
  };
  
  const { firstName, lastName, specialization } = getQueryParams();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    dateOfBirth: "",
    doctorName: `${firstName} `, 
    specialization: specialization, 
    patientId: user?.patientId || "",
    doctorId: id,
    appointmentDate: "",
    timeSlot: "",
    reasonForVisit: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`/api/v1/doctor/available-slots/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const sortedSlots = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAvailableSlots(sortedSlots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/v1/user/book-appointment/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        message.success(response.data.message);
        navigate('/home')
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Layout>
      <div className="mx-2">
        <div className="pt-4 text-center text-4xl font-bold">
          Make an Appointment
        </div>
        <div className="p-8">
          <form>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-4 placeholder-slate-400 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-4 placeholder-slate-400 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="my-6 flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-4 placeholder-slate-400 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="Phone Number *"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-4 placeholder-slate-400 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="my-6 flex gap-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">Doctor's Name</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-4 placeholder-slate-400 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                value={formData.doctorName}
                readOnly
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-4 placeholder-slate-400 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                value={formData.specialization}
                readOnly
              />
            </div>
            </div>
            <div className="my-6 flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">Appointment Date</label>
                <select
                  id="appointmentDate"
                  name="appointmentDate"
                  className="block w-full rounded-md border border-slate-300 bg-white px-3 py-4 font-semibold text-gray-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                >
                  <option className="font-semibold text-slate-300">
                    Select Appointment Date
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot.date} value={slot.date}>
                      {new Date(slot.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time Slot</label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  className="block w-full rounded-md border border-slate-300 bg-white px-3 py-4 font-semibold text-gray-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                >
                  <option className="font-semibold text-slate-300">
                    Select Time Slot
                  </option>
                  {availableSlots
                    .find((slot) => slot.date === formData.appointmentDate)
                    ?.timeSlots.filter((ts) => !ts.isBooked) 
                    .map((ts) => (
                      <option key={ts.slot} value={ts.slot}>
                        {ts.slot}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mb-10">
              <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
              <textarea
                id="reasonForVisit"
                name="reasonForVisit"
                className="h-40 w-full resize-none rounded-md border border-slate-300 p-5 font-semibold text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Reason for Visit (Optional)"
                value={formData.reasonForVisit}
                onChange={handleInputChange}
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="cursor-pointer rounded-lg bg-blue-700 px-8 py-5 text-sm font-semibold text-white"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
