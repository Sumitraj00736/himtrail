const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Homepage = require('../models/Homepage');
const Menu = require('../models/Menu');

const create = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

const list = (Model, sort = { createdAt: -1 }) =>
  asyncHandler(async (req, res) => {
    const docs = await Model.find().sort(sort);
    res.json({ data: docs });
  });

const update = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      res.status(404);
      throw new Error('Not found');
    }
    res.json({ data: doc });
  });

const remove = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Not found');
    }
    res.json({ data: doc });
  });

const getHomepage = asyncHandler(async (req, res) => {
  const doc = await Homepage.findOne().sort({ updatedAt: -1 });
  res.json({ data: doc });
});

const upsertHomepage = asyncHandler(async (req, res) => {
  const existing = await Homepage.findOne().sort({ updatedAt: -1 });
  let doc;
  if (existing) {
    doc = await Homepage.findByIdAndUpdate(existing._id, req.body, { new: true });
  } else {
    doc = await Homepage.create(req.body);
  }
  res.json({ data: doc });
});

module.exports = {
  createReview: create(Review),
  listReviews: list(Review),
  updateReview: update(Review),
  deleteReview: remove(Review),

  getHomepage,
  upsertHomepage,

  createMenu: create(Menu),
  listMenus: list(Menu, { order: 1 }),
  updateMenu: update(Menu),
  deleteMenu: remove(Menu),
};
