const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');

const listTrips = asyncHandler(async (req, res) => {
  const { category, destination, duration, region } = req.query;
  const query = {};

  if (category) query.category = category;
  if (destination) query.destination = destination;
  if (region) query.region = region;
  if (duration) query.duration = { $lte: Number(duration) };

  const trips = await Trip.find(query).sort({ createdAt: -1 });
  res.json({ data: trips });
});

const getTripBySlug = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ slug: req.params.slug });
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.json({ data: trip });
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.json({ data: trip });
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create(req.body);
  res.status(201).json({ data: trip });
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.json({ data: trip });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.json({ message: 'Deleted' });
});

module.exports = { listTrips, getTripBySlug, getTripById, createTrip, updateTrip, deleteTrip };
