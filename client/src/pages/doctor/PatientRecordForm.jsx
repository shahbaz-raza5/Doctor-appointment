import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "../../components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { message } from "antd";
const PatientRecordForm = () => {
  const { user } = useSelector((state) => state.user);
  const { id,index  } = useParams();
  console.log('patientId',id);
  
  const initialFormData = {
    patientName: "",
    doctorID: user._id,
    dateOfBirth: "",
    appointmentDate: "",
    timeSlot: "",
    reasonForVisit: "",
    symptoms: "",
    physicalExamination: "",
    diagnosis: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    labTests: "",
    followUpInstructions: "",
    nextAppointment: "",
    referral: "",
    doctorsNotes: "",
    doctorSignature: "",
    patientAcknowledgment: false,
  };
  const [formData, setFormData] = useState(initialFormData);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [patient, setPatient] = useState([]);
  const [appointment, setAppointment] = useState(null);
  useEffect(() => {
    getPatient();
  }, [id,index]);

  useEffect(() => {
    if (patient.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        patientName: appointment?.fullName || "",
        patientId: appointment?.patientId || "",
        dateOfBirth: formatDate(appointment?.dateOfBirth) || "",
        appointmentDate: formatDate(appointment?.appointmentDate) || "",
        timeSlot: appointment?.timeSlot || "",
        reasonForVisit: appointment?.reasonForVisit || "",
      }));
    }
  }, [patient,index]);

  const getPatient = async () => {
    console.log('PATIENT RECORD FORM',id);
    
    try {
      const response = await axios.get(`/api/v1/doctor/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Patient :", response.data.data);
      if (response.data) {

        setPatient(response.data.data);
        const appointmentData = response.data.data;
        const upcomingAppointment = appointmentData.filter(
          (appointment) => appointment.status === 'upcoming'
        );
        const upcomingAppointments=upcomingAppointment[parseInt(index)]
        console.log(upcomingAppointments);
        console.log(appointmentData);
        
        setAppointment(upcomingAppointments);
      }
    } catch (error) {
      console.error(
        "Error fetching Patient:",
        error.response?.data || error.message
      );
    }
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({ ...errors, [name]: false }); // Clear error on input change
  };

 const submitForm = async () => {
  const newErrors = {};

  // List of required fields
  const requiredFields = [
    'patientName',
    'patientId',
    'dateOfBirth',
    'appointmentDate',
    'timeSlot',
    'reasonForVisit',
    'diagnosis',
    'bloodPressure',
    'heartRate',
    'temperature',
    'respiratoryRate',
    'medicationName',
    'dosage',
    'frequency',
    'duration',
    'nextAppointment',
    'doctorsNotes',
    'doctorSignature',
    'patientAcknowledgment',
  ];

  // Validate required fields
  requiredFields.forEach((field) => {
    if (formData[field] === '' || (typeof formData[field] === 'boolean' && !formData[field])) {
      newErrors[field] = true;
    }
  });

  // Additional validation for date fields
  const dateFields = ['dateOfBirth', 'appointmentDate', 'nextAppointment'];
  dateFields.forEach((field) => {
    if (formData[field] && !/^\d{4}-\d{2}-\d{2}$/.test(formData[field])) {
      newErrors[field] = true; // Invalid date format
    }
  });

  // Check if there are any errors
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Stop the form submission if there are errors
  }

  // Convert date fields to ISO format if needed
  const formattedFormData = {
    ...formData,
    dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
    appointmentDate: new Date(formData.appointmentDate).toISOString(),
    nextAppointment: formData.nextAppointment ? new Date(formData.nextAppointment).toISOString() : null,
  };

 

  try {
    const response = await axios.post(
      `/api/v1/doctor/patient-form/${id}`,
      formattedFormData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Form submitted successfully:", response.data);
    if (response.data.success) {
      message.success(response.data.message);
      setFormData(initialFormData);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    message.error("Error submitting form");
  }
};

  const inputClassNames = (field) => `mt-1 block w-full px-4 py-2 border rounded-md ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  
  return (
    <Layout>
    <form className="mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Patient Checkup Details</h2>

      {/* Patient Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className={inputClassNames('patientName')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className={inputClassNames('patientId')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={inputClassNames('dateOfBirth')}
          />
        </div>
      </div>

      {/* Appointment Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            className={inputClassNames('appointmentDate')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Time Slot</label>
          <input
            type="text"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className={inputClassNames('timeSlot')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Reason for Visit</label>
          <input
            type="text"
            name="reasonForVisit"
            value={formData.reasonForVisit}
            onChange={handleChange}
            className={inputClassNames('reasonForVisit')}
          />
        </div>
      </div>

      {/* Checkup Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Symptoms</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className={inputClassNames('symptoms')}
            rows="3"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Physical Examination Findings</label>
          <textarea
            name="physicalExamination"
            value={formData.physicalExamination}
            onChange={handleChange}
            className={inputClassNames('physicalExamination')}
            rows="3"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            className={inputClassNames('diagnosis')}
            rows="3"
          ></textarea>
        </div>
      </div>

      {/* Vital Signs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Blood Pressure</label>
          <input
            type="text"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className={inputClassNames('bloodPressure')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Heart Rate</label>
          <input
            type="text"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            className={inputClassNames('heartRate')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Temperature</label>
          <input
            type="text"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className={inputClassNames('temperature')}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Respiratory Rate</label>
          <input
            type="text"
            name="respiratoryRate"
            value={formData.respiratoryRate}
            onChange={handleChange}
            className={inputClassNames('respiratoryRate')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Medication Name</label>
          <input
            type="text"
            name="medicationName"
            value={formData.medicationName}
            onChange={handleChange}
            className={inputClassNames('medicationName')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className={inputClassNames('dosage')}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Frequency</label>
          <input
            type="text"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className={inputClassNames('frequency')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={inputClassNames('duration')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Lab Tests</label>
          <input
            type="text"
            name="labTests"
            value={formData.labTests}
            onChange={handleChange}
            className={inputClassNames('labTests')}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Follow-up Instructions</label>
          <textarea
            name="followUpInstructions"
            value={formData.followUpInstructions}
            onChange={handleChange}
            className={inputClassNames('followUpInstructions')}
            rows="3"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Next Appointment</label>
          <input
            type="date"
            name="nextAppointment"
            value={formData.nextAppointment}
            onChange={handleChange}
            className={inputClassNames('nextAppointment')}
          />
        </div>
        <div>
          <label className="block text-gray-700">Referral</label>
          <textarea
            name="referral"
            value={formData.referral}
            onChange={handleChange}
            className={inputClassNames('referral')}
            rows="3"
          ></textarea>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700">Doctor's Notes</label>
          <textarea
            name="doctorsNotes"
            value={formData.doctorsNotes}
            onChange={handleChange}
            className={inputClassNames('doctorsNotes')}
            rows="3"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Doctor's Signature</label>
          <input
            type="text"
            name="doctorSignature"
            value={formData.doctorSignature}
            onChange={handleChange}
            className={inputClassNames('doctorSignature')}
          />
        </div>
      </div>

      {/* Acknowledgment */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="patientAcknowledgment"
            checked={formData.patientAcknowledgment}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2">Patient Acknowledgment</span>
        </label>
        {errors.patientAcknowledgment && (
          <p className="text-red-500 text-sm mt-2">Patient acknowledgment is required.</p>
        )}
      </div>

      <button
        type="button"
        onClick={submitForm}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  </Layout>
  );
};

export default PatientRecordForm;
