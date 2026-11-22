const db = require('../db/queries');

async function getAllBrands(req, res, next){
  try{
    const brands = await db.getAllBrands();
    res.render('brands', {brands});
  } catch(err){
    next(err);
  }
}

module.exports = {getAllBrands};