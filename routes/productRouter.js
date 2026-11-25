const { Router} = require('express');
const productController = require('../controllers/productController');
const {validateProduct} = require('../middleware/productValidator');
const adminAuth = require('../middleware/adminAuth');

const productRouter = Router();

productRouter.get('/new', productController.getNewProductForm);
productRouter.post('/new', validateProduct, productController.createProduct);

productRouter.get('/:id/edit', productController.getEditProductForm);
productRouter.post('/:id/edit', validateProduct, productController.updateProduct);

productRouter.get('/:id/delete', productController.getDeleteProductConfirmation);
productRouter.post('/:id/delete', adminAuth, productController.deleteProduct);

productRouter.get('/:id', productController.getProduct);

module.exports = productRouter;