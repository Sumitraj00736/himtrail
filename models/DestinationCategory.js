const mongoose = require('mongoose');

const DestinationCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    country: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true, default: '' },
    longDescription: { type: String, trim: true, default: '' },
    heroImage: { type: String, trim: true, default: '' },
    gallery: { type: [String], default: [] },
    tripIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DestinationCategory', DestinationCategorySchema);
