const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Homepage = require('../models/Homepage');
const Menu = require('../models/Menu');
const Trip = require('../models/Trip');
const TeamMember = require('../models/TeamMember');
const Destination = require('../models/Destination');
const DestinationCategory = require('../models/DestinationCategory');
const TripOption = require('../models/TripOption');
const { categoryHref } = require('../utils/destinationCategoryPaths');
const {
  resolveDestinationCategoriesFromMenu,
  getCategoryWithTrips,
} = require('../utils/resolveDestinationCategories');

const listReviews = asyncHandler(async (req, res) => {
  const docs = await Review.find().sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listDepartingSoon = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Departing Soon' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listBestSellers = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Best Seller' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const listFeaturedTrips = asyncHandler(async (req, res) => {
  const docs = await Trip.find({ displaySections: 'Featured' }).sort({ createdAt: -1 });
  res.json({ data: docs });
});

const getHomepage = asyncHandler(async (req, res) => {
  const doc = await Homepage.findOne().sort({ updatedAt: -1 });
  res.json({ data: doc });
});

/** Menus that auto-fill from Trip.displaySections (simple list menus only).
 *  Do NOT include Trekking in Nepal — that mega-menu keeps curated region columns.
 */
const SECTION_MENU_MAP = [
  { labelTest: /^luxury\s*travel$/i, section: 'Luxury Travel' },
];

const listMenus = asyncHandler(async (req, res) => {
  const docs = await Menu.find().sort({ order: 1 }).lean();

  const sectionMenus = docs.filter((menu) =>
    SECTION_MENU_MAP.some((m) => m.labelTest.test(menu.label || ''))
  );
  const sectionNames = [
    ...new Set(
      sectionMenus
        .map((menu) => SECTION_MENU_MAP.find((m) => m.labelTest.test(menu.label || ''))?.section)
        .filter(Boolean)
    ),
  ];

  const sectionTrips = sectionNames.length
    ? await Trip.find({ displaySections: { $in: sectionNames } })
        .select('_id slug title displaySections')
        .sort({ title: 1 })
        .lean()
    : [];

  const tripsBySection = new Map();
  sectionNames.forEach((name) => tripsBySection.set(name, []));
  sectionTrips.forEach((trip) => {
    (trip.displaySections || []).forEach((sec) => {
      if (tripsBySection.has(sec)) tripsBySection.get(sec).push(trip);
    });
  });

  /* Auto-fill Luxury Travel from trips tagged with that display section */
  docs.forEach((menu) => {
    const match = SECTION_MENU_MAP.find((m) => m.labelTest.test(menu.label || ''));
    if (!match) return;
    const tagged = tripsBySection.get(match.section) || [];
    menu.columns = [
      {
        title: menu.columns?.[0]?.title || match.section,
        items: tagged.map((trip) => ({
          label: trip.title,
          itemType: 'trip',
          tripId: trip._id,
          categoryId: null,
          href: `/trips/${trip.slug}`,
        })),
      },
    ];
  });

  const tripIds = [];
  const categoryIds = [];
  docs.forEach((menu) => {
    (menu.columns || []).forEach((col) => {
      (col.items || []).forEach((item) => {
        if (item.categoryId) categoryIds.push(item.categoryId);
        if (item.tripId) tripIds.push(item.tripId);
      });
    });
  });

  const [trips, categories] = await Promise.all([
    tripIds.length ? Trip.find({ _id: { $in: tripIds } }).select('_id slug').lean() : [],
    categoryIds.length
      ? DestinationCategory.find({ _id: { $in: categoryIds } }).select('_id slug country').lean()
      : [],
  ]);

  const tripsById = new Map(trips.map((t) => [String(t._id), t]));
  const catsById = new Map(categories.map((c) => [String(c._id), c]));

  docs.forEach((menu) => {
    (menu.columns || []).forEach((col) => {
      (col.items || []).forEach((item) => {
        if (item.categoryId) {
          const cat = catsById.get(String(item.categoryId));
          if (cat) item.href = categoryHref(cat);
          return;
        }
        if (!item.tripId) return;
        const trip = tripsById.get(String(item.tripId));
        if (trip?.slug) item.href = `/trips/${trip.slug}`;
      });
    });
  });

  res.json({ data: docs });
});

const listTrekkingInNepal = asyncHandler(async (req, res) => {
  const [trips, destinations] = await Promise.all([
    Trip.find({ displaySections: 'Trekking in Nepal' }).sort({ createdAt: -1 }),
    Destination.find({ destinationSections: 'Trek in Nepal' }).sort({ createdAt: -1 }),
  ]);
  res.json({ data: [...destinations, ...trips] });
});

const listLuxuryTravel = asyncHandler(async (req, res) => {
  const [trips, destinations] = await Promise.all([
    Trip.find({ displaySections: 'Luxury Travel' }).sort({ createdAt: -1 }),
    Destination.find({ destinationSections: 'Luxury Travel' }).sort({ createdAt: -1 }),
  ]);
  res.json({ data: [...destinations, ...trips] });
});

/**
 * Destination categories from the Destinations menu (navbar + homepage).
 */
const listDestinations = asyncHandler(async (req, res) => {
  let docs = await resolveDestinationCategoriesFromMenu();
  if (!docs.length) {
    docs = await DestinationCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    docs = docs.map((c) => ({
      ...c,
      href: categoryHref(c),
      packageCount: c.tripIds?.length || 0,
    }));
  }
  res.json({ data: docs });
});

const getDestinationCategoryPage = asyncHandler(async (req, res) => {
  const data = await getCategoryWithTrips(req.params.country, req.params.slug);
  if (!data) {
    res.status(404);
    throw new Error('Destination category not found');
  }
  res.json({ data });
});

const getDestinationBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  let doc = await Trip.findOne({ slug });
  if (!doc) {
    doc = await Destination.findOne({ slug });
  }
  if (!doc) {
    res.status(404);
    throw new Error('Destination not found');
  }
  res.json({ data: doc });
});

const listTeamMembers = asyncHandler(async (req, res) => {
  const docs = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  res.json({ data: docs });
});

/** Active countries, regions, categories for Trip/Destination forms */
const listTripOptions = asyncHandler(async (req, res) => {
  const docs = await TripOption.find({ isActive: true }).sort({ kind: 1, order: 1, name: 1 });
  const countries = docs.filter((d) => d.kind === 'country').map((d) => d.name);
  const categories = docs.filter((d) => d.kind === 'category').map((d) => d.name);
  const regionsByCountry = {};
  docs
    .filter((d) => d.kind === 'region')
    .forEach((d) => {
      if (!regionsByCountry[d.countryName]) regionsByCountry[d.countryName] = [];
      regionsByCountry[d.countryName].push(d.name);
    });
  res.json({
    data: {
      countries,
      categories,
      regionsByCountry,
      items: docs,
    },
  });
});

module.exports = {
  listReviews,
  listDepartingSoon,
  listBestSellers,
  listFeaturedTrips,
  getHomepage,
  listMenus,
  listTrekkingInNepal,
  listLuxuryTravel,
  listDestinations,
  getDestinationCategoryPage,
  getDestinationBySlug,
  listTeamMembers,
  listTripOptions,
};
