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
const { syncCategoryToMenu, removeCategoryFromMenu } = require('../utils/syncDestinationCategoryMenu');
const { resolveDestinationCategoriesFromMenu } = require('../utils/resolveDestinationCategories');

const create = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

const list = (Model, sort = { createdAt: -1 }) =>
  asyncHandler(async (req, res) => {
    const docs = await Model.find().sort(sort);
    res.json({ data: docs });
  });

const update = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      res.status(404);
      throw new Error('Not found');
    }
    res.json({ data: doc });
  });

const remove = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Not found');
    }
    res.json({ data: doc });
  });

const getHomepage = asyncHandler(async (req, res) => {
  const doc = await Homepage.findOne().sort({ updatedAt: -1 });
  res.json({ data: doc });
});

const upsertHomepage = asyncHandler(async (req, res) => {
  const existing = await Homepage.findOne().sort({ updatedAt: -1 });
  let doc;
  if (existing) {
    doc = await Homepage.findByIdAndUpdate(existing._id, req.body, { new: true });
  } else {
    doc = await Homepage.create(req.body);
  }
  res.json({ data: doc });
});

/** Resolve menu item links: categories → /destinations/{country}/{slug}, trips → /trips/{slug} */
const resolveMenuItemLinks = async (body) => {
  if (!body?.columns?.length) return body;

  const tripIds = [];
  const categoryIds = [];

  body.columns.forEach((col) => {
    (col.items || []).forEach((item) => {
      if (item.categoryId || item.itemType === 'category') {
        if (item.categoryId) categoryIds.push(item.categoryId);
      } else if (item.tripId) {
        tripIds.push(item.tripId);
      }
    });
  });

  const [trips, categories] = await Promise.all([
    tripIds.length
      ? Trip.find({ _id: { $in: tripIds } }).select('_id slug title').lean()
      : [],
    categoryIds.length
      ? DestinationCategory.find({ _id: { $in: categoryIds } })
          .select('_id slug title country')
          .lean()
      : [],
  ]);

  const tripsById = new Map(trips.map((t) => [String(t._id), t]));
  const catsById = new Map(categories.map((c) => [String(c._id), c]));

  const columns = body.columns.map((col) => ({
    ...col,
    items: (col.items || []).map((item) => {
      if (item.categoryId || item.itemType === 'category') {
        const cat = catsById.get(String(item.categoryId));
        if (!cat) {
          const err = new Error(`Category not found for menu item "${item.label || item.categoryId}"`);
          err.statusCode = 400;
          throw err;
        }
        return {
          label: item.label || cat.title,
          itemType: 'category',
          categoryId: cat._id,
          tripId: null,
          href: categoryHref(cat),
        };
      }

      if (!item.tripId) {
        if (!item.href) {
          const err = new Error('Each menu item needs a linked trip or category');
          err.statusCode = 400;
          throw err;
        }
        return {
          label: item.label,
          itemType: 'trip',
          href: item.href,
          tripId: null,
          categoryId: null,
        };
      }

      const trip = tripsById.get(String(item.tripId));
      if (!trip) {
        const err = new Error(`Trip not found for menu item "${item.label || item.tripId}"`);
        err.statusCode = 400;
        throw err;
      }

      return {
        label: item.label || trip.title,
        itemType: 'trip',
        tripId: trip._id,
        categoryId: null,
        href: `/trips/${trip.slug}`,
      };
    }),
  }));

  return { ...body, columns };
};

const resolveMenuTripLinks = resolveMenuItemLinks;

const createMenu = asyncHandler(async (req, res) => {
  const payload = await resolveMenuTripLinks(req.body);
  const doc = await Menu.create(payload);
  res.status(201).json({ data: doc });
});

const updateMenu = asyncHandler(async (req, res) => {
  const payload = await resolveMenuTripLinks(req.body);
  const doc = await Menu.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    res.status(404);
    throw new Error('Not found');
  }
  res.json({ data: doc });
});

const listTripOptionsAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.kind) filter.kind = req.query.kind;
  const docs = await TripOption.find(filter).sort({ kind: 1, order: 1, name: 1 });
  res.json({ data: docs });
});

const createTripOption = asyncHandler(async (req, res) => {
  const { kind, name, countryName = '', order = 0, isActive = true } = req.body;
  if (!kind || !name?.trim()) {
    res.status(400);
    throw new Error('kind and name are required');
  }
  if (kind === 'region' && !countryName?.trim()) {
    res.status(400);
    throw new Error('Regions must belong to a country');
  }
  const doc = await TripOption.create({
    kind,
    name: name.trim(),
    countryName: kind === 'region' ? countryName.trim() : '',
    order: Number(order) || 0,
    isActive: isActive !== false,
  });
  res.status(201).json({ data: doc });
});

const updateTripOption = asyncHandler(async (req, res) => {
  const existing = await TripOption.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error('Not found');
  }

  const nextKind = req.body.kind ?? existing.kind;
  const nextName = String(req.body.name ?? existing.name).trim();
  const nextCountry =
    nextKind === 'region'
      ? String(req.body.countryName ?? existing.countryName ?? '').trim()
      : '';

  if (!nextName) {
    res.status(400);
    throw new Error('name is required');
  }
  if (nextKind === 'region' && !nextCountry) {
    res.status(400);
    throw new Error('Regions must belong to a country');
  }

  const doc = await TripOption.findByIdAndUpdate(
    req.params.id,
    {
      kind: nextKind,
      name: nextName,
      countryName: nextCountry,
      order: req.body.order !== undefined ? Number(req.body.order) || 0 : existing.order,
      isActive: req.body.isActive !== undefined ? req.body.isActive : existing.isActive,
    },
    { new: true }
  );

  if (existing.kind === 'country' && existing.name !== nextName) {
    await TripOption.updateMany(
      { kind: 'region', countryName: existing.name },
      { $set: { countryName: nextName } }
    );
  }

  res.json({ data: doc });
});

const deleteTripOption = asyncHandler(async (req, res) => {
  const doc = await TripOption.findById(req.params.id);
  if (!doc) {
    res.status(404);
    throw new Error('Not found');
  }
  /* When deleting a country, also remove its regions */
  if (doc.kind === 'country') {
    await TripOption.deleteMany({ kind: 'region', countryName: doc.name });
  }
  await doc.deleteOne();
  res.json({ data: doc });
});

const listDestinationsAdmin = asyncHandler(async (req, res) => {
  let docs = await resolveDestinationCategoriesFromMenu();
  if (!docs.length) {
    docs = await DestinationCategory.find().sort({ order: 1, createdAt: -1 }).lean();
    docs = docs.map((c) => ({
      ...c,
      href: categoryHref(c),
      packageCount: c.tripIds?.length || 0,
    }));
  }
  res.json({ data: docs });
});

const createDestinationCategory = asyncHandler(async (req, res) => {
  const doc = await DestinationCategory.create(req.body);
  await syncCategoryToMenu(doc);
  res.status(201).json({ data: { ...doc.toObject(), href: categoryHref(doc) } });
});

const getDestinationCategoryById = asyncHandler(async (req, res) => {
  const doc = await DestinationCategory.findById(req.params.id).lean();
  if (!doc) {
    res.status(404);
    throw new Error('Not found');
  }
  const trips = doc.tripIds?.length
    ? await Trip.find({ _id: { $in: doc.tripIds } }).select('title slug region destination category heroImage price')
    : [];
  res.json({ data: { ...doc, href: categoryHref(doc), trips } });
});

const updateDestinationCategory = asyncHandler(async (req, res) => {
  const doc = await DestinationCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) {
    res.status(404);
    throw new Error('Not found');
  }
  await syncCategoryToMenu(doc);
  res.json({ data: { ...doc.toObject(), href: categoryHref(doc) } });
});

const deleteDestinationCategory = asyncHandler(async (req, res) => {
  const doc = await DestinationCategory.findById(req.params.id);
  if (!doc) {
    res.status(404);
    throw new Error('Not found');
  }
  await removeCategoryFromMenu(doc);
  await doc.deleteOne();
  res.json({ data: doc });
});

const deleteDestination = asyncHandler(async (req, res) => {
  const doc = await DestinationCategory.findById(req.params.id);
  if (doc) {
    await removeCategoryFromMenu(doc);
    await doc.deleteOne();
    res.json({ data: doc });
    return;
  }

  const legacy = await Destination.findById(req.params.id);
  if (legacy) {
    await legacy.deleteOne();
    res.json({ data: legacy });
    return;
  }

  res.status(404);
  throw new Error('Destination not found');
});

module.exports = {
  createReview: create(Review),
  listReviews: list(Review),
  updateReview: update(Review),
  deleteReview: remove(Review),

  getHomepage,
  upsertHomepage,

  createMenu,
  listMenus: list(Menu, { order: 1 }),
  updateMenu,
  deleteMenu: remove(Menu),

  createTeamMember: create(TeamMember),
  listTeamMembersAdmin: list(TeamMember, { order: 1, createdAt: -1 }),
  updateTeamMember: update(TeamMember),
  deleteTeamMember: remove(TeamMember),

  createDestination: create(Destination),
  listDestinationsAdmin,
  createDestinationCategory,
  getDestinationCategoryById,
  updateDestinationCategory,
  deleteDestinationCategory,
  updateDestination: update(Destination),
  deleteDestination,
  getDestinationById: asyncHandler(async (req, res) => {
    const category = await DestinationCategory.findById(req.params.id).lean();
    if (category) {
      const trips = category.tripIds?.length
        ? await Trip.find({ _id: { $in: category.tripIds } }).select('title slug region destination category heroImage price')
        : [];
      res.json({ data: { ...category, href: categoryHref(category), trips } });
      return;
    }
    const doc = await Destination.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Not found');
    }
    res.json({ data: doc });
  }),

  listTripOptionsAdmin,
  createTripOption,
  updateTripOption,
  deleteTripOption,
};
