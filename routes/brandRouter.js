const {Router} = require('express');
const brandController = require('../controllers/brandController');
const brandRouter = Router();

brandRouter.get('/', brandController.getAllBrands);
brandRouter.get('/:id', brandController.getBrand);

module.exports = brandRouter;