const { validationResult } = require('express-validator');
const db = require('../db/queries');

async function getAllBrands(req, res, next){
  try{
    const brands = await db.getAllBrands();
    res.render('brands', {brands});
  } catch(err){
    next(err);
  }
}

async function getBrand(req, res, next){
  try{
    const brandId = Number(req.params.id);
    if (!Number.isInteger(brandId) || brandId < 1) {
      return res.status(400).send("Invalid brand ID");
    }
    
    const brand = await db.getBrandById(brandId);
    if(!brand){
      return res.status(400).send('Brand not found');
    }

    const products = await db.getProductsByBrand(brandId);
    res.render('brand', {brand, products});
  } catch(err){
    next(err);
  }
}

async function getNewBrandForm(req, res) {
  res.render('brand-form', {
    formTitle: 'Add Brand',
    formAction: '/brands/new',
    brand: null,
    errors:[],
  });
}

async function createBrand(req, res, next) {
  const errors = validationResult(req);
  
    if(!errors.isEmpty()){
      return res.status(400).render('brand-form', {
        formTitle:'Add Brand',
        formAction: '/brands/new',
        brand: req.body,
        errors:errors.array(),
      });
    }
  
    try{
      const {name, description} = req.body;
      const brand = await db.createBrand(name, description);
      res.redirect(`/brands/${brand.id}`);
    }catch(error){
      if(error.code === '23505') {
        return res.status(400).render('brand-form', {
          formTitle: 'Add Brand',
          formAction: '/brands/new',
          brand: req.body,
          errors: [{ msg: 'A brand with this name already exists.' }],
        });
      }
      next(error);
    }
} 

module.exports = {getAllBrands, getBrand, getNewBrandForm, createBrand};