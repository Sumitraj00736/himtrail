const Menu = require('../models/Menu');
const Trip = require('../models/Trip');

const slugFromHref = (href = '') =>
  String(href)
    .replace(/^\/?(trips|destinations)\//i, '')
    .replace(/^\//, '')
    .toLowerCase()
    .trim();

/**
 * Destinations = trips linked under the Destinations menu (navbar source of truth).
 */
const resolveDestinationsFromMenu = async () => {
  const menus = await Menu.find().sort({ order: 1 }).lean();
  const destMenu = menus.find((m) => /destination/i.test(m.label || '')) || null;
  if (!destMenu?.columns?.length) return [];

  const refs = [];
  destMenu.columns.forEach((col) => {
    (col.items || []).forEach((item) => {
      if (!item.tripId && !item.href) return;
      refs.push({
        tripId: item.tripId || null,
        href: item.href || '',
        menuLabel: item.label || '',
        menuColumn: col.title || '',
      });
    });
  });

  if (!refs.length) return [];

  const tripIds = refs.map((r) => r.tripId).filter(Boolean);
  const trips = tripIds.length ? await Trip.find({ _id: { $in: tripIds } }).lean() : [];
  const byId = new Map(trips.map((t) => [String(t._id), t]));

  const slugs = refs
    .filter((r) => !r.tripId && r.href)
    .map((r) => slugFromHref(r.href))
    .filter(Boolean);
  const bySlugTrips = slugs.length ? await Trip.find({ slug: { $in: slugs } }).lean() : [];
  const bySlug = new Map(bySlugTrips.map((t) => [t.slug, t]));

  const seen = new Set();
  const results = [];

  refs.forEach((ref) => {
    let trip = ref.tripId ? byId.get(String(ref.tripId)) : null;
    if (!trip && ref.href) trip = bySlug.get(slugFromHref(ref.href)) || null;
    if (!trip) return;
    const key = String(trip._id);
    if (seen.has(key)) return;
    seen.add(key);

    results.push({
      ...trip,
      title: ref.menuLabel || trip.title,
      menuColumn: ref.menuColumn,
      menuLabel: ref.menuLabel,
      href: `/trips/${trip.slug}`,
      source: 'menu',
    });
  });

  return results;
};

module.exports = { resolveDestinationsFromMenu, slugFromHref };
