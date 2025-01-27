const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  // lastName: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  fees: {
    type: Number,
    required: true,
    
  },
  experience: {
    type: String,
    required: true,
    enum: ['0-2', '3-5', '6-10', '10+'],
  },
  specialization: {
    type: String,
    required: true,
    enum: [
      'General Practitioner',
      'Cardiologist',
      'Dermatologist',
      'Neurologist',
      'Pediatrician',
    ],
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true,
  },
  qualifications: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  profileImage: {
    type: String, // Add this field to store the path or URL of the profile image
    trim: true,
  },
}, {
  timestamps: true,
});

const doctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;
