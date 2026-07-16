const mongoose = require('mongoose');

/**
 * Shared trip taxonomy used by Trip & Destination forms.
 * kind: country | region | category
 * countryName: parent country for regions (dependency)
 */
const TripOptionSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: ['country', 'region', 'category'],
      index: true,
    },
    name: { type: String, required: true, trim: true },
    /** Parent country name — required when kind === 'region' */
    countryName: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TripOptionSchema.index(
  { kind: 1, name: 1, countryName: 1 },
  { unique: true }
);

module.exports = mongoose.model('TripOption', TripOptionSchema);
