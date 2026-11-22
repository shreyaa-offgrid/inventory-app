const db = require('../db/queries');
const {validationResult} = require('express-validator');

async function getAllCategories(req, res, next){
  try{
    const categories = await db.getAllCategories();
    res.render('categories', {categories});
  } catch(err){
    next(err);
  }
}

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

function getNewCategoryForm(req, res) {
  res.render('category-form', {
    formTitle: 'Add Category',
    formAction: '/categories/new',
    category: null,
    errors:[],
  });
}

async function createCategory(req, res, next){
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).render('category-form', {
      formTitle:'Add Category',
      formAction: '/categories/new',
      category: req.body,
      errors:errors.array(),
    });
  }

  try{
    const {name, description} = req.body;
    const category = await db.createCategory(name, description);
    res.redirect(`/categories/${category.id}`);
  }catch(error){
    if(error.code === '23505') {
      return res.status(400).render('category-form', {
        formTitle: 'Add Category',
        formAction: '/categories/new',
        category: req.body,
        errors: [{ msg: 'A category with this name already exists.' }],
      });
    }
    next(error);
  }
}

module.exports = { getAllCategories, getCategory, getNewCategoryForm , createCategory};