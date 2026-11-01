const pool = require("./pool");

// ---------- CATEGORIES ----------

async function getAllCategories() {
  const { rows } = await pool.query(
    "SELECT * FROM categories"
  );
  return rows;
}

async function getCategoryById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM categories WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function createCategory(name, description) {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );
  return rows[0];
}

async function updateCategory(id, name, description) {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1, description = $2
     WHERE id = $3
     RETURNING *`,
    [name, description, id]
  );
  return rows[0];
}

async function deleteCategory(id) {
  const { rows } = await pool.query(
    `DELETE FROM categories
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0];
}

// ---------- PRODUCTS ----------

async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT
      p.*,
      c.name AS category_name,
      b.name AS brand_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN brands b ON p.brand_id = b.id
    ORDER BY p.name
  `);
  return rows;
}

async function getProductById(id) {
  const { rows } = await pool.query(
    `SELECT
       p.*,
       c.name AS category_name,
       b.name AS brand_name
     FROM products p
     JOIN categories c ON p.category_id = c.id
     JOIN brands b ON p.brand_id = b.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0];
}

async function getProductsByCategory(categoryId) {
  if (Number(categoryId) === 5) {//accessories
    const { rows } = await pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        stock,
        'product' AS source
      FROM products
      WHERE category_id = $1

      UNION ALL

      SELECT
        id,
        name,
        type AS description,
        price,
        stock,
        'accessory' AS source
      FROM accessories
    `, [categoryId]);

    return rows;
  }

  const { rows } = await pool.query(
    'SELECT * FROM products WHERE category_id = $1',
    [categoryId]
  );

  return rows;
}

async function createProduct({
  name,
  description,
  price,
  stock,
  category_id,
  brand_id,
}) {
  const { rows } = await pool.query(
    `INSERT INTO products
       (name, description, price, stock, category_id, brand_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, price, stock, category_id, brand_id]
  );
  return rows[0];
}

async function updateProduct(id, {
  name,
  description,
  price,
  stock,
  category_id,
  brand_id,
}) {
  const { rows } = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         stock = $4,
         category_id = $5,
         brand_id = $6
     WHERE id = $7
     RETURNING *`,
    [name, description, price, stock, category_id, brand_id, id]
  );
  return rows[0];
}

async function deleteProduct(id) {
  const { rows } = await pool.query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0];
}

// ---------- BRANDS ----------

async function getAllBrands() {
  const { rows } = await pool.query(
    "SELECT * FROM brands ORDER BY name"
  );
  return rows;
}

// ---------- ACCESSORIES ----------

async function getAllAccessories() {
  const { rows } = await pool.query(
    "SELECT * FROM accessories ORDER BY name"
  );
  return rows;
}

async function getAccessoriesByProduct(productId) {
  const { rows } = await pool.query(
    `SELECT a.*
     FROM accessories a
     JOIN product_accessories pa ON a.id = pa.accessory_id
     WHERE pa.product_id = $1
     ORDER BY a.name`,
    [productId]
  );
  return rows;
}

module.exports = {
  getAllCategories, getCategoryById,
  createCategory, updateCategory, deleteCategory,
  getAllProducts, getProductById, getProductsByCategory,
  createProduct, updateProduct, deleteProduct,
  getAllBrands,
  getAllAccessories, getAccessoriesByProduct,
};
