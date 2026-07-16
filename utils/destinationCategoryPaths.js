const slugify = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const categoryHref = (category) => {
  const country = slugify(category.country);
  const slug = String(category.slug || '').toLowerCase();
  return `/destinations/${country}/${slug}`;
};

module.exports = { slugify, categoryHref };
