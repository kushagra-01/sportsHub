const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  fieldType: { type: String, required: true },
  date: { type: Date },
  slotsBooked: { type: Number },
  Starttiming: { type: String },
  endTiming: { type: String },
  isLongTerm: { type: Boolean, default: false },
  longTermStartDate: { type: Date },
  longTermEndDate: { type: Date },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
