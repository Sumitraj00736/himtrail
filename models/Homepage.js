const mongoose = require('mongoose');

const HomepageSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, required: true, trim: true },
    heroSubtitle: { type: String, required: true, trim: true },
    heroCtaLabel: { type: String, required: true, trim: true },
    heroCtaUrl: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true, trim: true },
    aboutTitle: { type: String, required: true, trim: true },
    aboutBody: { type: String, required: true, trim: true },
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Homepage', HomepageSchema);
