const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    groupSize: { type: Number, required: true, min: 1 },
    travelerName: { type: String, trim: true },
    travelerEmail: { type: String, trim: true },
    travelerPhone: { type: String, trim: true },
    tripStartDate: { type: String, trim: true },
    tripEndDate: { type: String, trim: true },
    tripPrice: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
