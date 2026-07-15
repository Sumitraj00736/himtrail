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

module.exports = router;
