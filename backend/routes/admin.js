import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get total counts
    const [usersResult, storesResult, productsResult, ordersResult] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM stores WHERE status = $1', ['active']),
      db.query('SELECT COUNT(*) FROM products WHERE status = $1', ['active']),
      db.query('SELECT COUNT(*) FROM orders')
    ]);

    // Get revenue statistics
    const revenueResult = await db.query(`
      SELECT 
        SUM(total_amount) as total_revenue,
        COUNT(*) as total_orders
      FROM orders 
      WHERE status IN ('delivered', 'confirmed')
    `);

    // Get recent orders
    const recentOrdersResult = await db.query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.full_name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // Get monthly revenue
    const monthlyRevenueResult = await db.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total_amount) as revenue,
        COUNT(*) as orders_count
      FROM orders 
      WHERE status IN ('delivered', 'confirmed')
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: parseInt(usersResult.rows[0].count),
          totalStores: parseInt(storesResult.rows[0].count),
          totalProducts: parseInt(productsResult.rows[0].count),
          totalOrders: parseInt(ordersResult.rows[0].count),
          totalRevenue: parseFloat(revenueResult.rows[0].total_revenue || 0),
          completedOrders: parseInt(revenueResult.rows[0].total_orders || 0)
        },
        recentOrders: recentOrdersResult.rows,
        monthlyRevenue: monthlyRevenueResult.rows
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات لوحة التحكم'
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, userType, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, email, full_name, phone, user_type, 
        created_at, updated_at
      FROM users
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (userType) {
      paramCount++;
      query += ` AND user_type = $${paramCount}`;
      params.push(userType);
    }

    if (search) {
      paramCount++;
      query += ` AND (full_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (userType) {
      countParamCount++;
      countQuery += ` AND user_type = $${countParamCount}`;
      countParams.push(userType);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (full_name ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalUsers = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين'
    });
  }
});

// Get all stores (including pending)
router.get('/stores', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        s.*,
        u.full_name as owner_name,
        u.email as owner_email
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (s.name ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: {
        stores: result.rows
      }
    });

  } catch (error) {
    console.error('Get admin stores error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المتاجر'
    });
  }
});

// Update store status
router.patch('/stores/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'suspended', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة'
      });
    }

    const result = await db.query(
      'UPDATE stores SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المتجر غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة المتجر بنجاح',
      data: {
        store: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update store status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة المتجر'
    });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (o.order_number ILIKE $${paramCount} OR u.full_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
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
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
});

export default router;