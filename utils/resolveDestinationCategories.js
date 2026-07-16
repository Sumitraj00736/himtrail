const Menu = require('../models/Menu');
const DestinationCategory = require('../models/DestinationCategory');
const Trip = require('../models/Trip');
const { categoryHref } = require('./destinationCategoryPaths');

/**
 * Categories linked in the Destinations menu (navbar + homepage source of truth).
 */
const resolveDestinationCategoriesFromMenu = async () => {
  const menus = await Menu.find().sort({ order: 1 }).lean();
  const destMenu = menus.find((m) => /destination/i.test(m.label || '')) || null;
  if (!destMenu?.columns?.length) return [];

  const refs = [];
  destMenu.columns.forEach((col) => {
    (col.items || []).forEach((item) => {
      if (item.itemType === 'category' && item.categoryId) {
        refs.push({
          categoryId: item.categoryId,
          menuLabel: item.label || '',
          menuColumn: col.title || '',
        });
        return;
      }
      if (item.href && /\/destinations\//i.test(item.href)) {
        refs.push({
          href: item.href,
          menuLabel: item.label || '',
          menuColumn: col.title || '',
        });
      }
    });
  });

  if (!refs.length) return [];

  const categoryIds = refs.map((r) => r.categoryId).filter(Boolean);
  const categories = categoryIds.length
    ? await DestinationCategory.find({ _id: { $in: categoryIds }, isActive: true }).lean()
    : [];
  const byId = new Map(categories.map((c) => [String(c._id), c]));

  const hrefSlugs = refs
    .filter((r) => !r.categoryId && r.href)
    .map((r) => {
      const parts = String(r.href).replace(/^\//, '').split('/');
      return parts[parts.length - 1]?.toLowerCase();
    })
    .filter(Boolean);
  const bySlugCats = hrefSlugs.length
    ? await DestinationCategory.find({ slug: { $in: hrefSlugs }, isActive: true }).lean()
    : [];
  const bySlug = new Map(bySlugCats.map((c) => [c.slug, c]));

  const seen = new Set();
  const results = [];

  for (const ref of refs) {
    let cat = ref.categoryId ? byId.get(String(ref.categoryId)) : null;
    if (!cat && ref.href) {
      const slug = String(ref.href).split('/').pop()?.toLowerCase();
      cat = slug ? bySlug.get(slug) : null;
    }
    if (!cat) continue;

    const key = String(cat._id);
    if (seen.has(key)) continue;
    seen.add(key);

    const tripCount = cat.tripIds?.length || 0;
    results.push({
      ...cat,
      title: ref.menuLabel || cat.title,
      menuColumn: ref.menuColumn || cat.country,
      menuLabel: ref.menuLabel || cat.title,
      href: categoryHref(cat),
      packageCount: tripCount,
      source: 'menu',
    });
  }

  return results;
};

const getCategoryWithTrips = async (countrySlug, slug) => {
  const category = await DestinationCategory.findOne({
    slug: String(slug).toLowerCase(),
    isActive: true,
  }).lean();

  if (!category) return null;

  const expectedCountry = String(countrySlug || '').toLowerCase();
  const actualCountry = String(category.country || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  if (expectedCountry && actualCountry !== expectedCountry) return null;

  const trips = category.tripIds?.length
    ? await Trip.find({ _id: { $in: category.tripIds } }).lean()
    : [];

  const orderMap = new Map((category.tripIds || []).map((id, i) => [String(id), i]));
  trips.sort((a, b) => (orderMap.get(String(a._id)) ?? 0) - (orderMap.get(String(b._id)) ?? 0));

  return {
    ...category,
    href: categoryHref(category),
    trips,
    packageCount: trips.length,
  };
};

module.exports = { resolveDestinationCategoriesFromMenu, getCategoryWithTrips };
