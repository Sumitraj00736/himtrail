const mongoose = require('mongoose');

const DepartingSoonSchema = new mongoose.Schema(
  {
    tripName: { type: String, required: true, trim: true },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DepartingSoon', DepartingSoonSchema);
