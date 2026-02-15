const express = require('express');
const {
  createReview,
  listReviews,
  updateReview,
  deleteReview,
  createDepartingSoon,
  listDepartingSoon,
  updateDepartingSoon,
  deleteDepartingSoon,
  createBestSeller,
  listBestSellers,
  updateBestSeller,
  deleteBestSeller,
  createFeaturedTrip,
  listFeaturedTrips,
  updateFeaturedTrip,
  deleteFeaturedTrip,
  getHomepage,
  upsertHomepage,
  createMenu,
  listMenus,
  updateMenu,
  deleteMenu,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { staffOrAdmin } = require('../middleware/roles');

const router = express.Router();

router.use(protect, staffOrAdmin);

router.get('/reviews', listReviews);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

router.get('/departing-soon', listDepartingSoon);
router.post('/departing-soon', createDepartingSoon);
router.put('/departing-soon/:id', updateDepartingSoon);
router.delete('/departing-soon/:id', deleteDepartingSoon);

router.get('/best-sellers', listBestSellers);
router.post('/best-sellers', createBestSeller);
router.put('/best-sellers/:id', updateBestSeller);
router.delete('/best-sellers/:id', deleteBestSeller);

router.get('/featured-trips', listFeaturedTrips);
router.post('/featured-trips', createFeaturedTrip);
router.put('/featured-trips/:id', updateFeaturedTrip);
router.delete('/featured-trips/:id', deleteFeaturedTrip);

router.get('/homepage', getHomepage);
router.put('/homepage', upsertHomepage);

router.get('/menus', listMenus);
router.post('/menus', createMenu);
router.put('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);

module.exports = router;
