const mongoose = require('mongoose');

// Define the schema for booking an appointment
const bookAppointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  doctorName: {
    type: String,
    required: false  // optional field
  },
  specialization: {
    type: String,
    required: false  // optional field
  },
  patientId: {
    type: String,
    required: false  // optional field
  },
  doctorId: {
    type: String,
    required: false  // optional field
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  reasonForVisit: {
    type: String,
    required: false  // optional field
  },
  status: {
    type: String,
    enum: ['upcoming', 'done', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const bookAppointmentModel = mongoose.model('BookAppointment', bookAppointmentSchema);

module.exports = bookAppointmentModel;
