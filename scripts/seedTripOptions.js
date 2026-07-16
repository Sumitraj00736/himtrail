/**
 * Seed default countries, regions, and categories for Trip Dependencies.
 * Usage: node server/scripts/seedTripOptions.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const TripOption = require('../models/TripOption');

const COUNTRIES = [
  { name: 'Nepal', order: 1 },
  { name: 'Tanzania', order: 2 },
  { name: 'Bhutan', order: 3 },
  { name: 'Tibet', order: 4 },
];

const REGIONS = {
  Nepal: ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Upper Mustang', 'Dolpo'],
  Tanzania: ['Tanzania'],
  Bhutan: ['Bhutan'],
  Tibet: ['Tibet'],
};

const CATEGORIES = [
  'Trekking',
  'Heli Tour',
  'Adventure',
  'Climbing',
  'Cultural',
  'Wildlife',
];

const upsert = async (doc) => {
  await TripOption.findOneAndUpdate(
    { kind: doc.kind, name: doc.name, countryName: doc.countryName || '' },
    { $set: doc },
    { upsert: true, new: true }
  );
};

const run = async () => {
  await connectDB(process.env.MONGO_URI);

  for (const c of COUNTRIES) {
    await upsert({ kind: 'country', name: c.name, countryName: '', order: c.order, isActive: true });
    console.log(`country: ${c.name}`);
  }

  for (const [country, regions] of Object.entries(REGIONS)) {
    regions.forEach(async () => {});
    for (let i = 0; i < regions.length; i += 1) {
      await upsert({
        kind: 'region',
        name: regions[i],
        countryName: country,
        order: i + 1,
        isActive: true,
      });
      console.log(`  region: ${country} → ${regions[i]}`);
    }
  }

  for (let i = 0; i < CATEGORIES.length; i += 1) {
    await upsert({
      kind: 'category',
      name: CATEGORIES[i],
      countryName: '',
      order: i + 1,
      isActive: true,
    });
    console.log(`category: ${CATEGORIES[i]}`);
  }

  console.log('Done seeding trip options.');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
