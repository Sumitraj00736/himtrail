const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const DepartingSoon = require('../models/DepartingSoon');
const BestSeller = require('../models/BestSeller');
const FeaturedTrip = require('../models/FeaturedTrip');
const Homepage = require('../models/Homepage');
const Menu = require('../models/Menu');

const listReviews = asyncHandler(async (req, res) => {
  const docs = await Review.find().sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listDepartingSoon = asyncHandler(async (req, res) => {
  const docs = await DepartingSoon.find().sort({ order: 1 });
  res.json({ data: docs });
});

const listBestSellers = asyncHandler(async (req, res) => {
  const docs = await BestSeller.find().sort({ order: 1 });
  res.json({ data: docs });
});

const listFeaturedTrips = asyncHandler(async (req, res) => {
  const docs = await FeaturedTrip.find().sort({ order: 1 });
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

module.exports = {
  listReviews,
  listDepartingSoon,
  listBestSellers,
  listFeaturedTrips,
  getHomepage,
  listMenus,
};
