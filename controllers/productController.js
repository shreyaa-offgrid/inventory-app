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

async function getNewProductForm(req, res, next) {
  try {
    const categories = await db.getAllCategories();
    const brands = await db.getAllBrands();
    res.render('product-form', {
      formTitle: "Add product",
      formAction: "/products/new",
      product: null,
      categories, brands,
      errors: [],
    })
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  const errors = validationResult(req);
  try {
    const categories = await db.getAllCategories();
    const brands = await db.getAllBrands();
    if (!errors.isEmpty()) {
      return res.status(400).render('product-form', {
        formTitle: 'Add Product',
        formAction: '/products/new',
        product: req.body,
        categories,
        brands,
        errors: errors.array(),
      });
    }

    const {
      name, description, price, stock, category_id, brand_id
    } = req.body;

    const product = await db.createProduct({
      name, description, price, stock, category_id, brand_id
    });

    res.redirect(`/products/${product.id}`);
  } catch (err) {
    if (err.code === '23503') {
      const categories = await db.getAllCategories();
      const brands = await db.getAllBrands();

      return res.status(400).render('product-form', {
        formTitle: 'Add Product',
        formAction: '/products/new',
        product: req.body,
        categories,
        brands,
        errors: [{ msg: 'Selected category or brand does not exist.' }],
      });
    }
    next(err);
  }
}

async function getEditProductForm(req, res, next) {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId < 1) {
      return res.status(400).send('Invalid product ID');
    }
    const product = await db.getProductById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    const categories = await db.getAllCategories();
    const brands = await db.getAllBrands();
    res.render('product-form', {
      formTitle: "Edit Product",
      formAction: `/products/${productId}/edit`,
      product, categories, brands,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  const errors = validationResult(req);
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).send('Invalid product ID');
  }

  try {
    const existingProduct = await db.getProductById(productId);

    if (!existingProduct) {
      return res.status(404).send('Product not found');
    }

    const categories = await db.getAllCategories();
    const brands = await db.getAllBrands();

    if (!errors.isEmpty()) {
      return res.status(400).render('product-form', {
        formTitle: 'Edit Product',
        formAction: `/products/${productId}/edit`,
        product: req.body,
        categories,
        brands,
        errors: errors.array(),
      });
    }

    const {
      name, description, price,
      stock, category_id, brand_id,
    } = req.body;

    const product = await db.updateProduct(productId, {
      name, description, price,
      stock, category_id, brand_id,
    });

    res.redirect(`/products/${product.id}`);
  } catch (err) {
    if (err.code === '23503') {
      const categories = await db.getAllCategories();
      const brands = await db.getAllBrands();

      return res.status(400).render('product-form', {
        formTitle: 'Edit Product',
        formAction: `/products/${productId}/edit`,
        product: req.body,
        categories,
        brands,
        errors: [{ msg: 'Selected category or brand does not exist.' }],
      });
    }
    next(err);
  }
}

async function getDeleteProductConfirmation(req, res, next){
  const prodId = Number(req.params.id);
  if(!Number.isInteger(prodId) || prodId<1){
    return res.status(400).send('Invalid product ID');
  }
  try{
    const product = await db.getProductById(prodId);
    if(!product){
      return res.status(404).send('Product not found');
    }
    const errors = req.query.error === 'invalid-password'
    ? [{ msg: 'Incorrect admin password.' }]
    : [];
    res.render('delete-confirm', {
      entityType: 'Product',
      entityName: product.name,
      formAction:`/products/${product.id}/delete`,
      cancelUrl:`/categories/${product.category_id}`,
      errors
    });
  } catch(err){
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  const prodId = Number(req.params.id);
  if(!Number.isInteger(prodId) || prodId<1){
    return res.status(400).send('Invalid product ID');
  }
  try{
    const product = await db.deleteProduct(prodId);
    if(!product){
      return res.status(404).send('Product not found');
    }
    res.redirect(`/categories/${product.category_id}`);
  } catch(error){
    next(error);
  }
}

module.exports = {
  getProduct, getNewProductForm, createProduct,
  getEditProductForm, updateProduct, 
  getDeleteProductConfirmation, deleteProduct
};