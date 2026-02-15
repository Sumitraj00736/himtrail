const express = require('express');
const {
  listTrips,
  getTripBySlug,
  createTrip,
  updateTrip,
} = require('../controllers/tripsController');
const { protect } = require('../middleware/auth');
const { staffOrAdmin } = require('../middleware/roles');

const router = express.Router();

// GET /api/trips?category=Trekking&destination=Nepal&region=Everest&duration=14
router.get('/', listTrips);
router.get('/:slug', getTripBySlug);

router.post('/', protect, staffOrAdmin, createTrip);
router.put('/:id', protect, staffOrAdmin, updateTrip);

module.exports = router;
