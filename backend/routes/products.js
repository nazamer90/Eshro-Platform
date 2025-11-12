import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      storeId, 
      minPrice, 
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.stock_quantity,
        p.status,
        p.created_at,
        s.name as store_name,
        s.id as store_id
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.status = 'active' AND s.status = 'active'
    `;
    
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (storeId) {
      paramCount++;
      query += ` AND p.store_id = $${paramCount}`;
      params.push(storeId);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND p.price >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND p.price <= $${paramCount}`;
      params.push(maxPrice);
    }

    // Validate sort parameters
    const validSortFields = ['created_at', 'price', 'name'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    query += ` ORDER BY p.${safeSortBy} ${safeSortOrder} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) 
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.status = 'active' AND s.status = 'active'
    `;
    const countParams = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND p.category = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (p.name ILIKE $${countParamCount} OR p.description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (storeId) {
      countParamCount++;
      countQuery += ` AND p.store_id = $${countParamCount}`;
      countParams.push(storeId);
    }

    if (minPrice) {
      countParamCount++;
      countQuery += ` AND p.price >= $${countParamCount}`;
      countParams.push(minPrice);
    }

    if (maxPrice) {
      countParamCount++;
      countQuery += ` AND p.price <= $${countParamCount}`;
      countParams.push(maxPrice);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalProducts = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        products: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasNext: page * limit < totalProducts,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات'
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        p.*,
        s.name as store_name,
        s.id as store_id,
        s.logo_url as store_logo,
        s.rating as store_rating
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.id = $1 AND p.status = 'active'
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    const product = result.rows[0];

    // Get related products from the same store
    const relatedResult = await db.query(`
      SELECT id, name, price, image_url
      FROM products 
      WHERE store_id = $1 AND id != $2 AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 4
    `, [product.store_id, id]);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts: relatedResult.rows
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتج'
    });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.category,
        COUNT(*) as product_count
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.status = 'active' AND s.status = 'active'
      GROUP BY p.category
      ORDER BY product_count DESC
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

// Search products
router.get('/search/advanced', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, storeId } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن يكون البحث أكثر من حرفين'
      });
    }

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.category,
        s.name as store_name,
        s.id as store_id,
        ts_rank(to_tsvector('arabic', p.name || ' ' || p.description), plainto_tsquery('arabic', $1)) as rank
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.status = 'active' AND s.status = 'active'
      AND (
        to_tsvector('arabic', p.name || ' ' || p.description) @@ plainto_tsquery('arabic', $1)
        OR p.name ILIKE $2
        OR p.description ILIKE $2
      )
    `;

    const params = [q, `%${q}%`];
    let paramCount = 2;

    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND p.price >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND p.price <= $${paramCount}`;
      params.push(maxPrice);
    }

    if (storeId) {
      paramCount++;
      query += ` AND p.store_id = $${paramCount}`;
      params.push(storeId);
    }

    query += ` ORDER BY rank DESC, p.created_at DESC LIMIT 20`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: {
        products: result.rows,
        searchTerm: q,
        totalResults: result.rows.length
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في البحث'
    });
  }
});

export default router;