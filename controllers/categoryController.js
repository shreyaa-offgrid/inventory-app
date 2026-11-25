const db = require('../db/queries');
const { validationResult } = require('express-validator');

async function getAllCategories(req, res, next) {
  try {
    const categories = await db.getAllCategories();
    res.render('categories', { categories });
  } catch (err) {
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
    errors: [],
  });
}

async function createCategory(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('category-form', {
      formTitle: 'Add Category',
      formAction: '/categories/new',
      category: req.body,
      errors: errors.array(),
    });
  }

  try {
    const { name, description } = req.body;
    const category = await db.createCategory(name, description);
    res.redirect(`/categories/${category.id}`);
  } catch (error) {
    if (error.code === '23505') {
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

async function getEditCategoryForm(req, res, next) {
  try {
    const categoryId = Number(req.params.id);
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).send('Invalid category ID');
    }

    const category = await db.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('category-form', {
      formTitle: 'Edit Category',
      formAction: `/categories/${categoryId}/edit`,
      category,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  const errors = validationResult(req);

  const categoryId = Number(req.params.id);
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return res.status(400).send('Invalid category ID');
  }

  try {
    const existingCategory = await db.getCategoryById(categoryId);

    if (!existingCategory) {
      return res.status(404).send('Category not found');
    }

    if (!errors.isEmpty()) {
      return res.status(400).render('category-form', {
        formTitle: 'Edit Category',
        formAction: `/categories/${categoryId}/edit`,
        category: req.body,
        errors: errors.array(),
      });
    }

    const { name, description } = req.body;

    const category = await db.updateCategory(
      categoryId, name, description
    );

    res.redirect(`/categories/${category.id}`);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).render('category-form', {
        formTitle: 'Edit Category',
        formAction: `/categories/${categoryId}/edit`,
        category: req.body,
        errors: [{ msg: 'A category with this name already exists.' }],
      });
    }

    next(error);
  }
}

async function getDeleteCategoryConfirmation(req, res, next) {
  const catId = Number(req.params.id);
  if (!Number.isInteger(catId) || catId < 1) {
    return res.status(400).send('Invalid category ID');
  }
  try {
    const category = await db.getCategoryById(catId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    const errors = [];
    if (req.query.error === 'invalid-password') {
      errors.push({ msg: 'Incorrect admin password.' });
    }
    if (req.query.error === 'category-not-empty') {
      errors.push({
        msg: 'This category contains products. Delete or reassign them before deleting the category.'
      });
    }
    res.render('delete-confirm', {
      entityType: 'Category',
      entityName: category.name,
      formAction: `/categories/${category.id}/delete`,
      cancelUrl: `/categories/${category.id}`,
      errors
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  const catId = Number(req.params.id);
  if (!Number.isInteger(catId) || catId < 1) {
    return res.status(400).send('Invalid category ID');
  }

  try {
    const category = await db.deleteCategory(catId);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.redirect('/categories/');
  } catch (error) {
    if (error.code === '23503') {
      return res.redirect(
        303,
        `/categories/${catId}/delete?error=category-not-empty`
      );
    }
    next(error);
  }
}

module.exports = {
  getAllCategories, getCategory,
  getNewCategoryForm, createCategory,
  getEditCategoryForm, updateCategory, 
  getDeleteCategoryConfirmation, deleteCategory
};