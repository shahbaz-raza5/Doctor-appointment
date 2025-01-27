const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  slot: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
});

const AvailableSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlots: [TimeSlotSchema],
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
});


const availableSlotModel = mongoose.model('AvailableSlot', AvailableSlotSchema);
module.exports = availableSlotModel;