const {Router } = require('express');
const categoryController = require('../controllers/categoryController');
const {validateCategory} = require('../middleware/categoryValidator');
const adminAuth = require('../middleware/adminAuth');
const categoryRouter = Router();

categoryRouter.get('/', categoryController.getAllCategories);

categoryRouter.get('/new', categoryController.getNewCategoryForm);
categoryRouter.post('/new',validateCategory, categoryController.createCategory); 

categoryRouter.get('/:id/edit', categoryController.getEditCategoryForm);
categoryRouter.post('/:id/edit', validateCategory, categoryController.updateCategory);

categoryRouter.get('/:id/delete', categoryController.getDeleteCategoryConfirmation);
categoryRouter.post('/:id/delete', adminAuth, categoryController.deleteCategory);

categoryRouter.get('/:id', categoryController.getCategory);

module.exports = categoryRouter;