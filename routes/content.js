const express = require('express');
const {
  listReviews,
  listDepartingSoon,
  listBestSellers,
  listFeaturedTrips,
  getHomepage,
  listMenus,
  listTrekkingInNepal,
  listLuxuryTravel,
} = require('../controllers/contentController');

const router = express.Router();

router.get('/reviews', listReviews);
router.get('/departing-soon', listDepartingSoon);
router.get('/best-sellers', listBestSellers);
router.get('/featured-trips', listFeaturedTrips);
router.get('/homepage', getHomepage);
router.get('/menus', listMenus);
router.get('/trekking-in-nepal', listTrekkingInNepal);
router.get('/luxury-travel', listLuxuryTravel);

module.exports = router;
