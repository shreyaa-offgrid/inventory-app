const db = require("../db/queries");

async function getProduct(req, res, next) {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId < 1) {
      return res.status(400).send("Invalid product ID");
    }
    const product = await db.getProductById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const accessories = await db.getAccessoriesByProduct(productId);
    res.render("product", { product, accessories });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProduct };