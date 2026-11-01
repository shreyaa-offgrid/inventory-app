const db = require('../db/queries');

async function getCategory(req, res, next) {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).send("Invalid category ID");
    }

    const category = await db.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    const products = await db.getProductsByCategory(categoryId);

    res.render("category", { category, products });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCategory };