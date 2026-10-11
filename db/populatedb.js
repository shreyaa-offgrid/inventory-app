const pool = require("./pool");

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        stock INTEGER NOT NULL CHECK (stock >= 0),
        category_id INTEGER NOT NULL
          REFERENCES categories(id),
        brand_id INTEGER NOT NULL
          REFERENCES brands(id)
      );

      CREATE TABLE IF NOT EXISTS accessories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        type VARCHAR(100),
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        stock INTEGER NOT NULL CHECK (stock >= 0)
      );

      CREATE TABLE IF NOT EXISTS product_accessories (
        product_id INTEGER NOT NULL
          REFERENCES products(id) ON DELETE CASCADE,
        accessory_id INTEGER NOT NULL
          REFERENCES accessories(id) ON DELETE CASCADE,
        PRIMARY KEY (product_id, accessory_id)
      );
    `);

    console.log("Tables created.");

    await client.query(`
      INSERT INTO categories (name, description)
      VALUES
        ('Acoustic Guitars', 'Steel-string acoustic guitars'),
        ('Electric Guitars', 'Electric guitars and related instruments'),
        ('Amplifiers', 'Guitar amplifiers'),
        ('Effects', 'Guitar effects pedals'),
        ('Accessories', 'Essential guitar accessories')
      ON CONFLICT (name) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO brands (name, description)
      VALUES
        ('Yamaha', 'Japanese musical instrument manufacturer'),
        ('Fender', 'American guitar manufacturer'),
        ('Ibanez', 'Japanese guitar manufacturer'),
        ('Marshall', 'British amplifier manufacturer'),
        ('Boss', 'Japanese effects pedal manufacturer'),
        ('D''Addario', 'Manufacturer of strings and accessories')
      ON CONFLICT (name) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO products
        (name, description, price, stock, category_id, brand_id)
      VALUES
        (
          'Yamaha F310',
          'Steel-string acoustic guitar for beginners',
          9999, 10,
          (SELECT id FROM categories WHERE name = 'Acoustic Guitars'),
          (SELECT id FROM brands WHERE name = 'Yamaha')
        ),
        (
          'Fender CD-60S',
          'Dreadnought acoustic guitar',
          18500, 6,
          (SELECT id FROM categories WHERE name = 'Acoustic Guitars'),
          (SELECT id FROM brands WHERE name = 'Fender')
        ),
        (
          'Yamaha Pacifica 112V',
          'Versatile electric guitar',
          28999, 5,
          (SELECT id FROM categories WHERE name = 'Electric Guitars'),
          (SELECT id FROM brands WHERE name = 'Yamaha')
        ),
        (
          'Ibanez GRX40',
          'Entry-level electric guitar',
          21999, 7,
          (SELECT id FROM categories WHERE name = 'Electric Guitars'),
          (SELECT id FROM brands WHERE name = 'Ibanez')
        ),
        (
          'Marshall MG15',
          '15-watt practice amplifier',
          10999, 8,
          (SELECT id FROM categories WHERE name = 'Amplifiers'),
          (SELECT id FROM brands WHERE name = 'Marshall')
        ),
        (
          'Boss DS-1',
          'Distortion effects pedal',
          6999, 12,
          (SELECT id FROM categories WHERE name = 'Effects'),
          (SELECT id FROM brands WHERE name = 'Boss')
        ),
        (
          'D''Addario EXL110',
          'Nickel-wound electric guitar strings',
          799, 20,
          (SELECT id FROM categories WHERE name = 'Accessories'),
          (SELECT id FROM brands WHERE name = 'D''Addario')
        ),
        (
          'D''Addario Guitar Strap',
          'Adjustable guitar strap',
          999, 15,
          (SELECT id FROM categories WHERE name = 'Accessories'),
          (SELECT id FROM brands WHERE name = 'D''Addario')
        )
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO accessories (name, type, price, stock)
      VALUES
        ('Guitar Tuner', 'Tuner', 999, 20),
        ('Guitar Stand', 'Stand', 1499, 15),
        ('Guitar Gig Bag', 'Bag', 1999, 12),
        ('Instrument Cable', 'Cable', 699, 25),
        ('Guitar Strap', 'Strap', 999, 20),
        ('Guitar Picks', 'Picks', 199, 50)
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO product_accessories (product_id, accessory_id)
      SELECT p.id, a.id
      FROM (
        VALUES
          ('Yamaha F310', 'Guitar Tuner'),
          ('Yamaha F310', 'Guitar Stand'),
          ('Yamaha F310', 'Guitar Gig Bag'),
          ('Yamaha F310', 'Guitar Strap'),
          ('Fender CD-60S', 'Guitar Tuner'),
          ('Fender CD-60S', 'Guitar Stand'),
          ('Fender CD-60S', 'Guitar Gig Bag'),
          ('Yamaha Pacifica 112V', 'Guitar Tuner'),
          ('Yamaha Pacifica 112V', 'Instrument Cable'),
          ('Yamaha Pacifica 112V', 'Guitar Strap'),
          ('Ibanez GRX40', 'Guitar Tuner'),
          ('Ibanez GRX40', 'Instrument Cable'),
          ('Ibanez GRX40', 'Guitar Strap'),
          ('Marshall MG15', 'Instrument Cable')
      ) AS mapping(product_name, accessory_name)
      JOIN products p ON p.name = mapping.product_name
      JOIN accessories a ON a.name = mapping.accessory_name
      ON CONFLICT DO NOTHING;
    `);

    await client.query("COMMIT");
    console.log("Database populated successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Database setup failed:", error);
  process.exitCode = 1;
});