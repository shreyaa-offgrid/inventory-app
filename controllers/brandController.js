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

module.exports = {getAllBrands, getBrand};