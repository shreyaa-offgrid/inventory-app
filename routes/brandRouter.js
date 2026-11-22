const {Router} = require('express');
const brandController = require('../controllers/brandController');
const brandRouter = Router();

brandRouter.get('/', brandController.getAllBrands);

module.exports = brandRouter;