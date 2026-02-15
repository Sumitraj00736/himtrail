require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Trip = require('../models/Trip');

const regions = {
  'Everest Region': [
    'Everest Base Camp Trek - 15 Days',
    'Everest Base Camp Trek - 14 Days',
    'Everest Base Camp Trek - 12 Days',
    'Everest Helicopter Trek - 13 Days',
    'Gokyo Lakes and Renjola Pass Trek',
    'Pikey Peak Trek - 9 Days',
    'Footprint Special Everest Base Camp Trek - 16 Days',
    'Everest Base Camp Yoga Trek - 16 Days',
    'Everest Chola Pass Trek - 18 Days',
    'Everest Three Pass Trek - 21 Days',
    'Everest Panorama Trek - 8 Days',
    'Everest Base Camp Trek via Salleri - 18 Days',
  ],
  'Annapurna Region': [
    'Mardi Himal Trek - 9 Days',
    'Annapurna Circuit & Tilicho Lake Trek',
    'Annapurna Base Camp Trek - 8 Days',
    'Annapurna Base Camp Trek - 10 Days',
    'Ghorepani Poon Hill Trek - 8 Days',
    'Tilicho Lake Trek - 9 Days',
    'Khopra Danda Trek - 10 Days',
    'Annapurna Circuit Trek - 13 Days',
    'Nar-Phu Valley Trek - 13 Days',
    'Annapurna Circuit Biking Trek - 14 Days',
  ],
  'Manaslu Region': [
    'Manaslu Circuit Trek - 15 Days',
    'Manaslu Circuit and Tsum Valley Trek - 21 Days',
    'Tsum Valley Trek - 14 Days',
  ],
  'Langtang Region': [
    'Langtang Valley Trek - 11 Days',
    'Yala Peak Climbing - 14 Days',
    'Ruby Valley Trek - 12 days',
    'Langtang Valley and Gosaikunda Lake Trek - 16 Days',
  ],
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const parseDuration = (title) => {
  const match = title.match(/(\d+)\s*days?/i);
  return match ? Number(match[1]) : 10;
};

const baseHero = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';

const seed = async () => {
  await connectDB(process.env.MONGO_URI);
  const docs = [];

  Object.entries(regions).forEach(([region, titles]) => {
    titles.forEach((title) => {
      const duration = parseDuration(title);
      const slug = slugify(title);
      docs.push({
        title,
        slug,
        destination: 'Nepal',
        category: 'Trekking',
        region: region.replace(' Region', ''),
        duration,
        price: 1490,
        oldPrice: 1800,
        heroImage: baseHero,
        shortDescription: `${title} is one of our signature trekking experiences in Nepal.`,
        longDescription: `${title} offers breathtaking Himalayan scenery, cultural immersion, and a carefully planned itinerary tailored for trekkers seeking a world-class adventure.`,
        tripGrade: 'Strenuous',
        maxAltitude: '5,545 m',
        groupSize: '1-20',
        activity: 'Trek, Flight & Tour',
        destinationLabel: 'TIA Kathmandu',
        included: [
          'Airport pick-up and drop by private vehicles',
          'Kathmandu City Tour with a tour guide',
          'Full board meals during the trek',
          'All necessary permits and entrance fees',
        ],
        excluded: ['International flights', 'Personal expenses', 'Travel insurance'],
        dates: [
          {
            startDate: 'February 24, 2026',
            endDate: 'March 10, 2026',
            status: 'Available',
            price: 'US$1540',
          },
        ],
      });
    });
  });

  for (const doc of docs) {
    await Trip.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
  }

  console.log('Trips seeded:', docs.length);
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
