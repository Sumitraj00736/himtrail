const mongoose = require('mongoose');

const BestSellerSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    oldPrice: { type: String, trim: true },
    reviews: { type: String, trim: true },
    image: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BestSeller', BestSellerSchema);
