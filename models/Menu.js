const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    itemType: { type: String, enum: ['trip', 'category'], default: 'trip' },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DestinationCategory',
      default: null,
    },
    /* Auto-filled on save. Categories → /destinations/{country}/{slug}; trips → /trips/{slug} */
    href: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const MenuGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    items: { type: [MenuItemSchema], default: [] },
  },
  { _id: false }
);

const MenuSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    style: { type: String, enum: ['mega', 'list'], default: 'mega' },
    columns: { type: [MenuGroupSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', MenuSchema);
