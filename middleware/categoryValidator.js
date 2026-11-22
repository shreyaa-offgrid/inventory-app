const {body} = require('express-validator');

//validation middleware
const validateCategory = [

  body('name').trim().notEmpty()
  .withMessage('Category name is required.')
  .isLength({max: 100})
  .withMessage('Category name must be at most 100 chars.'), 

  body('description').trim(),
];

module.exports = {validateCategory};