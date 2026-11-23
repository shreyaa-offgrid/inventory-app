const {Router} = require('express');
const brandController = require('../controllers/brandController');
const {validateBrand} = require('../middleware/brandValidator');
const brandRouter = Router();

brandRouter.get('/', brandController.getAllBrands);
brandRouter.get('/new', brandController.getNewBrandForm);
brandRouter.post('/new', validateBrand, brandController.createBrand);
brandRouter.get('/:id', brandController.getBrand);

module.exports = brandRouter;