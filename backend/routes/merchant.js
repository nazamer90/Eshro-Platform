import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// Get merchant dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const merchantId = 1; // This should come from authenticated user

    // Get merchant's store
    const storeResult = await db.query(
      'SELECT id FROM stores WHERE owner_id = $1',
      [merchantId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد متجر مرتبط بهذا الحساب'
      });
    }

    const storeId = storeResult.rows[0].id;

    // Get statistics
    const [productsResult, ordersResult, revenueResult] = await Promise.all([
      db.query('SELECT COUNT(*) FROM products WHERE store_id = $1', [storeId]),
      db.query(`
        SELECT COUNT(*) 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE p.store_id = $1
      `, [storeId]),
      db.query(`
        SELECT SUM(oi.total) as total_revenue
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE p.store_id = $1 AND o.status IN ('delivered', 'confirmed')
      `, [storeId])
    ]);

    // Get recent orders
    const recentOrdersResult = await db.query(`
      SELECT DISTINCT
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.full_name as customer_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.customer_id = u.id
      WHERE p.store_id = $1
      ORDER BY o.created_at DESC
      LIMIT 5
    `, [storeId]);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts: parseInt(productsResult.rows[0].count),
          totalOrders: parseInt(ordersResult.rows[0].count),
          totalRevenue: parseFloat(revenueResult.rows[0].total_revenue || 0)
        },
        recentOrders: recentOrdersResult.rows
      }
    });

  } catch (error) {
    console.error('Get merchant dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات المتجر'
    });
  }
});

// Get merchant's products
router.get('/products', async (req, res) => {
  try {
    const merchantId = 1; // This should come from authenticated user
    const { page = 1, limit = 12, status, search } = req.query;
    const offset = (page - 1) * limit;

    // Get merchant's store
    const storeResult = await db.query(
      'SELECT id FROM stores WHERE owner_id = $1',
      [merchantId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد متجر مرتبط بهذا الحساب'
      });
    }

    const storeId = storeResult.rows[0].id;

    let query = `
      SELECT 
        p.*,
        s.name as store_name
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.store_id = $1
    `;

    const params = [storeId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND p.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: {
        products: result.rows
      }
    });

  } catch (error) {
    console.error('Get merchant products error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات'
    });
  }
});

// Add new product
router.post('/products', [
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0 }),
  body('category').notEmpty(),
  body('stockQuantity').isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const merchantId = 1; // This should come from authenticated user

    // Get merchant's store
    const storeResult = await db.query(
      'SELECT id FROM stores WHERE owner_id = $1 AND status = $2',
      [merchantId, 'active']
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد متجر نشط مرتبط بهذا الحساب'
      });
    }

    const storeId = storeResult.rows[0].id;

    const { 
      name, 
      description, 
      price, 
      category, 
      stockQuantity, 
      imageUrl,
      specifications 
    } = req.body;

    const result = await db.query(`
      INSERT INTO products (
        store_id, name, description, price, category, 
        stock_quantity, image_url, specifications, 
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `, [
      storeId, name, description, price, category, 
      stockQuantity, imageUrl, JSON.stringify(specifications || {}), 
      'active'
    ]);

    res.status(201).json({
      success: true,
      message: 'تم إضافة المنتج بنجاح',
      data: {
        product: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المنتج'
    });
  }
});

// Update product
router.put('/products/:id', [
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0 }),
  body('category').notEmpty(),
  body('stockQuantity').isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const merchantId = 1; // This should come from authenticated user

    // Check if product belongs to merchant
    const productResult = await db.query(`
      SELECT p.id 
      FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.id = $1 AND s.owner_id = $2
    `, [id, merchantId]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود أو غير مصرح لك بتعديله'
      });
    }

    const { 
      name, 
      description, 
      price, 
      category, 
      stockQuantity, 
      imageUrl,
      specifications,
      status 
    } = req.body;

    const result = await db.query(`
      UPDATE products SET
        name = $1,
        description = $2,
        price = $3,
        category = $4,
        stock_quantity = $5,
        image_url = $6,
        specifications = $7,
        status = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [
      name, description, price, category, 
      stockQuantity, imageUrl, JSON.stringify(specifications || {}), 
      status || 'active', id
    ]);

    res.json({
      success: true,
      message: 'تم تحديث المنتج بنجاح',
      data: {
        product: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المنتج'
    });
  }
});

// Get merchant's orders
router.get('/orders', async (req, res) => {
  try {
    const merchantId = 1; // This should come from authenticated user
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    // Get merchant's store
    const storeResult = await db.query(
      'SELECT id FROM stores WHERE owner_id = $1',
      [merchantId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد متجر مرتبط بهذا الحساب'
      });
    }

    const storeId = storeResult.rows[0].id;

    let query = `
      SELECT DISTINCT
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_method,
        o.created_at,
        u.full_name as customer_name,
        u.phone as customer_phone
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.customer_id = u.id
      WHERE p.store_id = $1
    `;

    const params = [storeId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: {
        orders: result.rows
      }
    });

  } catch (error) {
    console.error('Get merchant orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
});

export default router;