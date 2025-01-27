const mongoose = require('mongoose');

// Define the schema for the patient form
const patientFormSchema = new mongoose.Schema({
  visitDate: {
    type: Date,
    required: true
  },
  patientId: {
    type: String,
    ref: 'Patient', // Reference to the Patient model
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    patientName: {
      type: String,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
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
      required: true
    },
    symptoms: {
      type: String,
      required: false // optional field
    },
    physicalExamination: {
      type: String,
      required: false // optional field
    },
    diagnosis: {
      type: String,
      required: false // optional field
    },
    bloodPressure: {
      type: String,
      required: false // optional field
    },
    heartRate: {
      type: String,
      required: false // optional field
    },
    temperature: {
      type: String,
      required: false // optional field
    },
    respiratoryRate: {
      type: String,
      required: false // optional field
    },
    medicationName: {
      type: String,
      required: false // optional field
    },
    dosage: {
      type: String,
      required: false // optional field
    },
    frequency: {
      type: String,
      required: false // optional field
    },
    duration: {
      type: String,
      required: false // optional field
    },
    labTests: {
      type: String,
      required: false // optional field
    },
    followUpInstructions: {
      type: String,
      required: false // optional field
    },
    nextAppointment: {
      type: Date,
      required: false // optional field
    },
    referral: {
      type: String,
      required: false // optional field
    },
    doctorsNotes: {
      type: String,
      required: false // optional field
    },
    doctorSignature: {
      type: String,
      required: false // optional field
    },
    patientAcknowledgment: {
      type: Boolean,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const patientFormModel = mongoose.model('PatientForm', patientFormSchema);

module.exports = patientFormModel;
