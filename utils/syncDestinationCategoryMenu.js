const Menu = require('../models/Menu');
const { categoryHref } = require('./destinationCategoryPaths');

const findDestinationsMenu = async () => Menu.findOne({ label: /destination/i });

/**
 * Keep Destinations mega-menu in sync when categories are created/updated/deleted.
 */
const syncCategoryToMenu = async (category) => {
  if (!category) return null;

  let menu = await findDestinationsMenu();
  if (!menu) {
    menu = await Menu.create({
      label: 'Destinations',
      style: 'mega',
      order: 0,
      columns: [],
    });
  }

  const columns = (menu.columns || []).map((col) => ({
    title: col.title,
    items: [...(col.items || [])],
  }));

  let colIndex = columns.findIndex((c) => c.title === category.country);
  if (colIndex === -1) {
    columns.push({ title: category.country, items: [] });
    colIndex = columns.length - 1;
  }

  const href = categoryHref(category);
  const itemPayload = {
    label: category.title,
    itemType: 'category',
    categoryId: category._id,
    tripId: null,
    href,
  };

  const items = columns[colIndex].items || [];
  const existingIdx = items.findIndex(
    (item) =>
      String(item.categoryId) === String(category._id) ||
      (item.label === category.title && item.itemType === 'category')
  );

  if (category.isActive === false) {
    if (existingIdx !== -1) items.splice(existingIdx, 1);
  } else if (existingIdx !== -1) {
    items[existingIdx] = { ...items[existingIdx], ...itemPayload };
  } else {
    items.push(itemPayload);
  }

  columns[colIndex].items = items;
  menu.columns = columns;
  await menu.save();
  return menu;
};

const removeCategoryFromMenu = async (category) => {
  const menu = await findDestinationsMenu();
  if (!menu || !category) return null;

  const columns = (menu.columns || []).map((col) => ({
    title: col.title,
    items: (col.items || []).filter(
      (item) => String(item.categoryId) !== String(category._id)
    ),
  }));

  menu.columns = columns;
  await menu.save();
  return menu;
};

module.exports = { syncCategoryToMenu, removeCategoryFromMenu, findDestinationsMenu };
