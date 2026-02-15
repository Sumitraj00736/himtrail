const express = require('express');
const {
  createBooking,
  listMyBookings,
  listAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

const router = express.Router();

router.post('/', optionalAuth, createBooking);
router.get('/mine', protect, listMyBookings);
router.get('/', protect, adminOnly, listAllBookings);
router.put('/:id', protect, adminOnly, updateBookingStatus);

module.exports = router;
