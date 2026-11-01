const { Router} = require('express');
const productController = require('../controllers/productController');

const productRouter = Router();

productRouter.get('/:id', productController.getProduct);

module.exports = productRouter;