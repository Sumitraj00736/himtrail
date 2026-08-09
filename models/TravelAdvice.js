const mongoose = require('mongoose');

const travelAdviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    metaDescription: {
      type: String,
      default: '',
      trim: true,
    },
    /** Array of image URLs displayed as a mosaic/collage in the hero area */
    heroImages: {
      type: [String],
      default: [],
    },
    /** HTML content from CKEditor (supports paste-from-Word) */
    content: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title before saving if slug is empty
travelAdviceSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('TravelAdvice', travelAdviceSchema);
