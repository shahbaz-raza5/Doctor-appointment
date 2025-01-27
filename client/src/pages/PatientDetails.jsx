import React, { useState, useEffect } from 'react';
import { Layout } from '../components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Empty from '../components/Empty';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PatientDetails = ({ id: propsId }) => {
  const { id: paramsId } = useParams();
  const id = propsId || paramsId;
  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisitIndex, setSelectedVisitIndex] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    getPatientDetails();
  }, []);

  const getPatientDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/doctor/patient-details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });


      const formattedVisits = response.data.map((visit) => ({
        ...visit,
        visitDate: formatDate(visit.visitDate),
        details: {
          ...visit.details,
          dob: formatDate(visit.details.dob),
          appointmentDate: formatDate(visit.details.appointmentDate),
          nextAppointment: formatDate(visit.details.nextAppointment),
        },
      }));

      console.log('Patient Details:', formattedVisits);
      setPatientVisits(formattedVisits);
    } catch (error) {
      console.error('Error fetching patient details:', error.response?.data || error.message);
    }
  };

  const handleVisitClick = (index) => {
    if (selectedVisitIndex === index) {
      setSelectedVisitIndex(null);
      setFormData(null);
    } else {
      setSelectedVisitIndex(index);
      setFormData({ ...patientVisits[index].details });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    const updatedVisits = [...patientVisits];
    updatedVisits[selectedVisitIndex].details = formData;
    setPatientVisits(updatedVisits);
    alert('Details updated successfully!');
  };

  const handleCancel = () => {
    setSelectedVisitIndex(null);
    setFormData(null);
  };

  return (
    <Layout>
      {patientVisits.length===0 ? <Empty/>:
      <div className="mx-auto p-6 bg-white  rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Patient Checkup Details</h2>

      
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Visit Dates</h3>
          {patientVisits.map((visit, index) => (
            <div key={index} className="mb-2">
              <button
                className={`text-left w-full px-4 py-2 border rounded-md ${
                  selectedVisitIndex === index
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleVisitClick(index)}
              >
                {visit.visitDate}
              </button>
            </div>
          ))}
        </div>

        {selectedVisitIndex !== null && formData && (
          <form onSubmit={handleUpdateDetails} className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Edit Visit Date: {patientVisits[selectedVisitIndex].visitDate}
            </h3>

   
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Patient ID</label>
                <input
                  type="text"
                  name="patientID"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700">Appointment Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Time Slot</label>
                <input
                  type="text"
                  name="timeSlot"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Reason for Visit</label>
                <input
                  type="text"
                  name="reasonForVisit"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.reasonForVisit}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700">Symptoms</label>
                <textarea
                  name="symptoms"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  rows="3"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Physical Examination Findings</label>
                <textarea
                  name="physicalExamination"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  rows="3"
                  value={formData.physicalExamination}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  rows="3"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700">Blood Pressure</label>
                <input
                  type="text"
                  name="bloodPressure"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Heart Rate</label>
                <input
                  type="text"
                  name="heartRate"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Respiratory Rate</label>
                <input
                  type="text"
                  name="respiratoryRate"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.respiratoryRate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700">Next Appointment</label>
                <input
                  type="date"
                  name="nextAppointment"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={formData.nextAppointment}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Remarks</label>
                <textarea
                  name="remarks"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  rows="3"
                  value={formData.remarks}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>}
    </Layout>
  );
};

export default PatientDetails;
