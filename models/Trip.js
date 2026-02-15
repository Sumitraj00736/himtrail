const mongoose = require('mongoose');

const ItineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SustainabilitySchema = new mongoose.Schema(
  {
    co2Neutral: { type: Boolean, default: false },
    carryMeBagCampaign: { type: Boolean, default: false },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    destination: {
      type: String,
      required: true,
      enum: ['Nepal', 'Tanzania', 'Bhutan', 'Tibet'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Trekking',
        'Heli Tour',
        'Adventure',
        'Climbing',
        'Cultural',
        'Wildlife',
      ],
    },
    region: {
      type: String,
      required: true,
      enum: [
        'Everest',
        'Annapurna',
        'Langtang',
        'Manaslu',
        'Upper Mustang',
        'Dolpo',
        'Tibet',
        'Bhutan',
        'Tanzania',
      ],
    },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    heroImage: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    longDescription: { type: String, trim: true },
    tripGrade: { type: String, trim: true },
    maxAltitude: { type: String, trim: true },
    groupSize: { type: String, trim: true },
    activity: { type: String, trim: true },
    destinationLabel: { type: String, trim: true },
    gallery: { type: [String], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    dates: {
      type: [
        {
          startDate: String,
          endDate: String,
          status: String,
          price: String,
        },
      ],
      default: [],
    },
    reviews: {
      rating: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    sustainability: SustainabilitySchema,
    itinerary: { type: [ItineraryDaySchema], default: [] },
    departingSoon: { type: Boolean, default: false },
    statusBadge: { type: String, trim: true },
  },
  { timestamps: true }
);

TripSchema.index({ title: 'text', destination: 1, region: 1, category: 1 });

module.exports = mongoose.model('Trip', TripSchema);
