const {Router } = require('express');
const categoryController = require('../controllers/categoryController');
const {validateCategory} = require('../middleware/categoryValidator');
const categoryRouter = Router();

categoryRouter.get('/', categoryController.getAllCategories);

categoryRouter.get('/new', categoryController.getNewCategoryForm);
categoryRouter.post('/new',validateCategory, categoryController.createCategory); 

categoryRouter.get('/:id', categoryController.getCategory);

module.exports = categoryRouter;