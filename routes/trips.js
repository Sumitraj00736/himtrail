const express = require('express');
const {
  listTrips,
  getTripBySlug,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripsController');
const { protect } = require('../middleware/auth');
const { staffOrAdmin } = require('../middleware/roles');

const router = express.Router();

// GET /api/trips?category=Trekking&destination=Nepal&region=Everest&duration=14
router.get('/', listTrips);
router.get('/id/:id', getTripById);
router.get('/:slug', getTripBySlug);

router.post('/', protect, staffOrAdmin, createTrip);
router.put('/:id', protect, staffOrAdmin, updateTrip);
router.delete('/:id', protect, staffOrAdmin, deleteTrip);

module.exports = router;
