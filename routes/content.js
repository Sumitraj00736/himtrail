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
  listDestinations,
  getDestinationCategoryPage,
  getDestinationBySlug,
  listTeamMembers,
  listTripOptions,
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
router.get('/destinations', listDestinations);
router.get('/destinations/:country/:slug', getDestinationCategoryPage);
router.get('/destinations/:slug', getDestinationBySlug);
router.get('/team', listTeamMembers);
router.get('/trip-options', listTripOptions);

module.exports = router;
