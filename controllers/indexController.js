const db = require('../db/queries');

async function getIndex(req, res, next){
  try{
    const categories = await db.getAllCategories();
    res.render('index', {categories});
  } catch(err){
    next(err);
  }
}

module.exports = {getIndex};