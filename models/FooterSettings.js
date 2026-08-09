const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, trim: true, default: '' }, // facebook, instagram, youtube, etc.
    url: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const PartnerLogoSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    linkUrl: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const PaymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const FooterLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: '' },
    href: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const FooterColumnSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    links: { type: [FooterLinkSchema], default: [] },
  },
  { _id: false }
);

const FooterSettingsSchema = new mongoose.Schema(
  {
    // Newsletter section
    newsletterTitle: { type: String, trim: true, default: 'Subscribe Newsletter' },
    newsletterSubtitle: { type: String, trim: true, default: 'Get updates on our latest trips and offers.' },

    // Brand section
    tagline: { type: String, trim: true, default: '' },

    // Contact
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },

    // Social links (ordered list)
    socialLinks: { type: [SocialLinkSchema], default: [] },

    // Partner logos (NTB, TAAN, Tripadvisor, KAYAK, etc.)
    partnerLogos: { type: [PartnerLogoSchema], default: [] },

    // Payment method logos (Visa, Mastercard, etc.)
    paymentMethods: { type: [PaymentMethodSchema], default: [] },

    // Dynamic link columns (Company Profile, Destination, etc.)
    columns: { type: [FooterColumnSchema], default: [] },

    // Copyright text
    copyrightText: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FooterSettings', FooterSettingsSchema);
