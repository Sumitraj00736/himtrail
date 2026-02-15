const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

const createBooking = asyncHandler(async (req, res) => {
  const {
    trip,
    groupSize,
    notes,
    travelerName,
    travelerEmail,
    travelerPhone,
    tripStartDate,
    tripEndDate,
    tripPrice,
  } = req.body;

  const booking = await Booking.create({
    user: req.user?._id,
    trip,
    groupSize,
    notes,
    travelerName,
    travelerEmail,
    travelerPhone,
    tripStartDate,
    tripEndDate,
    tripPrice,
  });
  res.status(201).json({ data: booking });
});

const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('trip')
    .sort({ createdAt: -1 });
  res.json({ data: bookings });
});

const listAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('trip')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ data: bookings });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json({ data: booking });
});

module.exports = {
  createBooking,
  listMyBookings,
  listAllBookings,
  updateBookingStatus,
};
