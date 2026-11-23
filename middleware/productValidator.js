const {body} = require('express-validator');
const validateProduct = [
  
  body('name').trim()
  .notEmpty().withMessage('Product name is required.')
  .isLength({max:150}).withMessage('Product name must be at most 150 chars.'), 
  
  body('description').trim(),
  
  body('price').trim()
  .notEmpty().withMessage('Price is required.')
  .bail()
  .isFloat({min: 0}).withMessage('Price must be a non-negative number.'),
  
  body('stock').trim()
  .notEmpty().withMessage('Stock is required.')
  .bail()
  .isInt({min: 0}).withMessage('Stock must be a non-negative integer.'),

  body('category_id')
  .isInt({min:1}).withMessage('Select a valid category.'),

  body('brand_id')
  .isInt({min:1}).withMessage('Select a valid brand.'),
];

module.exports = {validateProduct};