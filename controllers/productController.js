const { validationResult } = require("express-validator");
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

async function getNewProductForm(req, res, next){
  try{
    const categories = await db.getAllCategories();
    const brands = await db.getAllBrands();
    res.render('product-form', {
      formTitle: "Add product",
      formAction: "/products/new",
      product: null,
      categories, brands, 
      errors:[],
    })
  } catch(err){
    next(err);
  }
}

async function createProduct(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).render('product-form', {
      formTitle: 'Add Product',
      formAction: "/products/new",
      product: req.body,
      categories, brands, 
      errors:errors.array(),
    });
  }

  try{
    const {
      name, description, price, stock, category_id, brand_id
    } = req.body;
    const product = await db.createProduct({
      name, description, price, stock, category_id, brand_id
    });
    res.redirect(`/products/${product.id}`);
  } catch(err){
    next(err);
  }
}

module.exports = { getProduct, getNewProductForm, createProduct };