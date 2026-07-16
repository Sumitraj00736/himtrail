/**
 * One-time migration: copy trips marked isDestination:true into the Destination collection.
 * Usage: node server/scripts/migrateDestinations.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');

const run = async () => {
  await connectDB();
  const trips = await Trip.find({ isDestination: true });
  console.log(`Found ${trips.length} trip(s) marked as destination`);

  let created = 0;
  let skipped = 0;

  for (const trip of trips) {
    const exists = await Destination.findOne({ slug: trip.slug });
    if (exists) {
      skipped += 1;
      continue;
    }
    const data = trip.toObject();
    delete data._id;
    delete data.__v;
    data.isDestination = true;
    await Destination.create(data);
    created += 1;
    console.log(`  + ${trip.slug}`);
  }

  console.log(`Done. Created ${created}, skipped ${skipped}.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
