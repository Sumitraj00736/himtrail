const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Homepage = require('../models/Homepage');
const Menu = require('../models/Menu');
const Trip = require('../models/Trip');

const listReviews = asyncHandler(async (req, res) => {
  const docs = await Review.find().sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listDepartingSoon = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Departing Soon' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listBestSellers = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Best Seller' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listFeaturedTrips = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Featured' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const getHomepage = asyncHandler(async (req, res) => {
  const doc = await Homepage.findOne().sort({ updatedAt: -1 });
  res.json({ data: doc });
});

const listMenus = asyncHandler(async (req, res) => {
  const docs = await Menu.find().sort({ order: 1 });
  res.json({ data: docs });
});

const listTrekkingInNepal = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Trekking in Nepal' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listLuxuryTravel = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Luxury Travel' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

module.exports = {
  listReviews,
  listDepartingSoon,
  listBestSellers,
  listFeaturedTrips,
  getHomepage,
  listMenus,
  listTrekkingInNepal,
  listLuxuryTravel,
};
