const {Router} = require('express');
const brandController = require('../controllers/brandController');
const {validateBrand} = require('../middleware/brandValidator');
const adminAuth = require('../middleware/adminAuth');
const brandRouter = Router();

brandRouter.get('/', brandController.getAllBrands);

brandRouter.get('/new', brandController.getNewBrandForm);
brandRouter.post('/new', validateBrand, brandController.createBrand);

brandRouter.get('/:id/edit', brandController.getEditBrandForm);
brandRouter.post('/:id/edit', validateBrand, brandController.updateBrand);

brandRouter.get('/:id/delete', brandController.getDeleteBrandConfirmation);
brandRouter.post('/:id/delete', adminAuth, brandController.deleteBrand);

brandRouter.get('/:id', brandController.getBrand);

module.exports = brandRouter;