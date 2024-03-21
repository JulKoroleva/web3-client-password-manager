export const addAction = (category, item) => ({
  type: "ADD",
  payload: {
    category,
    item,
  },
});

export const deleteAction = (category, itemIndex) => ({
  type: "DELETE",
  payload: {
    category,
    itemIndex,
  },
});

export const editAction = (category, itemIndex, newItem) => ({
  type: "EDIT",
  payload: {
    category,
    itemIndex,
    newItem,
  },
});

export const importItems = (importCategory, importedItems) => ({
  type: "IMPORT",
  payload: {
    importCategory,
    importedItems,
  },
});

export const addNewCategory = (
  newCategory,
  categoryIcon,
  categoryIconColor,
  items
) => ({
  type: "IMPORT",
  payload: {
    newCategory,
    categoryIcon,
    categoryIconColor,
    items,
  },
});
