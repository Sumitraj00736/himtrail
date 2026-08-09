const express = require('express');
const {
  createReview,
  listReviews,
  updateReview,
  deleteReview,
  getHomepage,
  upsertHomepage,
  createMenu,
  listMenus,
  updateMenu,
  deleteMenu,
  createTeamMember,
  listTeamMembersAdmin,
  updateTeamMember,
  deleteTeamMember,
  createDestination,
  listDestinationsAdmin,
  createDestinationCategory,
  getDestinationCategoryById,
  updateDestinationCategory,
  deleteDestinationCategory,
  updateDestination,
  deleteDestination,
  getDestinationById,
  listTripOptionsAdmin,
  createTripOption,
  updateTripOption,
  deleteTripOption,
  listTravelAdviceAdmin,
  createTravelAdvice,
  getTravelAdviceById,
  updateTravelAdvice,
  deleteTravelAdvice,
  listAboutPagesAdmin,
  createAboutPage,
  getAboutPageById,
  updateAboutPage,
  deleteAboutPage,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { staffOrAdmin } = require('../middleware/roles');

const router = express.Router();

router.use(protect, staffOrAdmin);

router.get('/reviews', listReviews);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

router.get('/homepage', getHomepage);
router.put('/homepage', upsertHomepage);

router.get('/menus', listMenus);
router.post('/menus', createMenu);
router.put('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);

router.get('/team', listTeamMembersAdmin);
router.post('/team', createTeamMember);
router.put('/team/:id', updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

router.get('/destinations', listDestinationsAdmin);
router.post('/destinations', createDestinationCategory);
router.get('/destinations/:id', getDestinationCategoryById);
router.put('/destinations/:id', updateDestinationCategory);
router.delete('/destinations/:id', deleteDestinationCategory);

router.get('/trip-options', listTripOptionsAdmin);
router.post('/trip-options', createTripOption);
router.put('/trip-options/:id', updateTripOption);
router.delete('/trip-options/:id', deleteTripOption);

router.get('/travel-advice', listTravelAdviceAdmin);
router.post('/travel-advice', createTravelAdvice);
router.get('/travel-advice/:id', getTravelAdviceById);
router.put('/travel-advice/:id', updateTravelAdvice);
router.delete('/travel-advice/:id', deleteTravelAdvice);

router.get('/about-pages', listAboutPagesAdmin);
router.post('/about-pages', createAboutPage);
router.get('/about-pages/:id', getAboutPageById);
router.put('/about-pages/:id', updateAboutPage);
router.delete('/about-pages/:id', deleteAboutPage);

module.exports = router;
