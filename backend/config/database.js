import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Database query function with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Get a client from the pool for transactions
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('❌ Error getting database client:', error);
    throw error;
  }
};

// Initialize database tables if they don't exist
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Check if tables exist
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    
    if (existingTables.length === 0) {
      console.log('📋 No tables found, creating initial schema...');
      await createInitialSchema();
    } else {
      console.log(`✅ Found ${existingTables.length} existing tables`);
    }
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// Create initial database schema
const createInitialSchema = async () => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(20) DEFAULT 'customer' CHECK (user_type IN ('customer', 'merchant', 'admin')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Stores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(500),
        banner_url VARCHAR(500),
        category VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_products INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        stock_quantity INTEGER DEFAULT 0,
        specifications JSONB,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::INTEGER,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
        payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash_on_delivery', 'moamalat', 'mobicash')),
        shipping_address JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Order items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id)');
    
    // Insert sample data
    await insertSampleData(client);
    
    await client.query('COMMIT');
    console.log('✅ Database schema created successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating database schema:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Insert sample data
const insertSampleData = async (client) => {
  try {
    // Insert sample admin user
    await client.query(`
      INSERT INTO users (email, password, full_name, user_type) 
      VALUES ('admin@eshro.ly', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'مدير النظام', 'admin')
      ON CONFLICT (email) DO NOTHING
    `);
    
    // Insert sample merchant user
    await client.query(`
      INSERT INTO users (email, password, full_name, user_type) 
      VALUES ('merchant@eshro.ly', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'تاجر تجريبي', 'merchant')
      ON CONFLICT (email) DO NOTHING
    `);
    
    // Insert sample customer user
    await client.query(`
      INSERT INTO users (email, password, full_name, user_type) 
      VALUES ('customer@eshro.ly', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'عميل تجريبي', 'customer')
      ON CONFLICT (email) DO NOTHING
    `);
    
    // Get merchant user ID
    const merchantResult = await client.query('SELECT id FROM users WHERE email = $1', ['merchant@eshro.ly']);
    if (merchantResult.rows.length > 0) {
      const merchantId = merchantResult.rows[0].id;
      
      // Insert sample store
      await client.query(`
        INSERT INTO stores (owner_id, name, description, category, status) 
        VALUES ($1, 'متجر إشرو التجريبي', 'متجر تجريبي لعرض منتجات متنوعة', 'إلكترونيات', 'active')
        ON CONFLICT DO NOTHING
      `, [merchantId]);
      
      // Get store ID
      const storeResult = await client.query('SELECT id FROM stores WHERE owner_id = $1', [merchantId]);
      if (storeResult.rows.length > 0) {
        const storeId = storeResult.rows[0].id;
        
        // Insert sample products
        const sampleProducts = [
          ['هاتف ذكي', 'هاتف ذكي بمواصفات عالية', 299.99, 'إلكترونيات', 10],
          ['لابتوب', 'لابتوب للألعاب والعمل', 899.99, 'إلكترونيات', 5],
          ['سماعات لاسلكية', 'سماعات بلوتوث عالية الجودة', 79.99, 'إلكترونيات', 20],
          ['ساعة ذكية', 'ساعة ذكية مع مراقب صحي', 199.99, 'إلكترونيات', 15]
        ];
        
        for (const product of sampleProducts) {
          await client.query(`
            INSERT INTO products (store_id, name, description, price, category, stock_quantity, status) 
            VALUES ($1, $2, $3, $4, $5, $6, 'active')
            ON CONFLICT DO NOTHING
          `, [storeId, ...product]);
        }
      }
    }
    
    console.log('✅ Sample data inserted successfully');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
};

// Export database functions
export default {
  query,
  getClient,
  pool,
  initializeDatabase
};

// Initialize database on startup
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase();
}