const {body} = require('express-validator');

const validateBrand = [
  body('name').trim()
  .notEmpty().withMessage('Brand name is required.')
  .isLength({max: 100}).withMessage('Brand name must be at most 100 chars.'), 

  body('description').trim(),
];

module.exports = {validateBrand};