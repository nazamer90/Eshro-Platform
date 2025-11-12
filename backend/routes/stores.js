import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// Get all stores
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, status = 'active' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        s.id,
        s.name,
        s.description,
        s.logo_url,
        s.banner_url,
        s.category,
        s.status,
        s.rating,
        s.total_products,
        s.created_at,
        u.full_name as owner_name
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE s.status = $1
    `;
    
    const params = [status];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND s.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (s.name ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM stores s WHERE s.status = $1';
    const countParams = [status];
    let countParamCount = 1;

    if (category) {
      countParamCount++;
      countQuery += ` AND s.category = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (s.name ILIKE $${countParamCount} OR s.description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalStores = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        stores: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalStores / limit),
          totalStores,
          hasNext: page * limit < totalStores,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المتاجر'
    });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        s.*,
        u.full_name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المتجر غير موجود'
      });
    }

    const store = result.rows[0];

    // Get store products
    const productsResult = await db.query(`
      SELECT 
        id, name, price, image_url, category, status, created_at
      FROM products 
      WHERE store_id = $1 AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 12
    `, [id]);

    res.json({
      success: true,
      data: {
        store,
        products: productsResult.rows
      }
    });

  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المتجر'
    });
  }
});

// Get store categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        category,
        COUNT(*) as store_count
      FROM stores 
      WHERE status = 'active'
      GROUP BY category
      ORDER BY store_count DESC
    `);

    res.json({
      success: true,
      data: {
        categories: result.rows
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الفئات'
    });
  }
});

// Create new store (for merchants)
router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('category').notEmpty(),
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

    // This would normally require authentication middleware
    // For now, we'll use a placeholder owner_id
    const { name, description, category, logoUrl, bannerUrl } = req.body;
    const ownerId = 1; // This should come from authenticated user

    const result = await db.query(`
      INSERT INTO stores (
        name, description, category, logo_url, banner_url, 
        owner_id, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
      RETURNING *
    `, [name, description, category, logoUrl, bannerUrl, ownerId]);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المتجر بنجاح وهو في انتظار المراجعة',
      data: {
        store: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المتجر'
    });
  }
});

export default router;