const express = require('express');
const {
  listReviews,
  listDepartingSoon,
  listBestSellers,
  listFeaturedTrips,
  getHomepage,
  listMenus,
} = require('../controllers/contentController');

const router = express.Router();

router.get('/reviews', listReviews);
router.get('/departing-soon', listDepartingSoon);
router.get('/best-sellers', listBestSellers);
router.get('/featured-trips', listFeaturedTrips);
router.get('/homepage', getHomepage);
router.get('/menus', listMenus);

module.exports = router;
