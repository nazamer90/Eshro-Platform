import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// Create new order
router.post('/', [
  body('items').isArray({ min: 1 }),
  body('shippingAddress').notEmpty(),
  body('paymentMethod').isIn(['cash_on_delivery', 'moamalat', 'mobicash']),
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

    const { items, shippingAddress, paymentMethod, notes } = req.body;
    const customerId = 1; // This should come from authenticated user

    // Start transaction
    await db.query('BEGIN');

    try {
      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const productResult = await db.query(
          'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 AND status = $2',
          [item.productId, 'active']
        );

        if (productResult.rows.length === 0) {
          throw new Error(`المنتج ${item.productId} غير موجود`);
        }

        const product = productResult.rows[0];

        if (product.stock_quantity < item.quantity) {
          throw new Error(`المنتج ${product.name} غير متوفر بالكمية المطلوبة`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal
        });
      }

      // Create order
      const orderResult = await db.query(`
        INSERT INTO orders (
          customer_id, total_amount, status, payment_method, 
          shipping_address, notes, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, order_number, created_at
      `, [customerId, totalAmount, 'pending', paymentMethod, JSON.stringify(shippingAddress), notes]);

      const order = orderResult.rows[0];

      // Create order items
      for (const item of orderItems) {
        await db.query(`
          INSERT INTO order_items (
            order_id, product_id, quantity, price, total
          ) VALUES ($1, $2, $3, $4, $5)
        `, [order.id, item.productId, item.quantity, item.price, item.total]);

        // Update product stock
        await db.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, item.productId]
        );
      }

      // Commit transaction
      await db.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الطلب بنجاح',
        data: {
          order: {
            id: order.id,
            orderNumber: order.order_number,
            totalAmount,
            status: 'pending',
            paymentMethod,
            createdAt: order.created_at,
            items: orderItems
          }
        }
      });

    } catch (error) {
      // Rollback transaction
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطأ في إنشاء الطلب'
    });
  }
});

// Get user orders
router.get('/my-orders', async (req, res) => {
  try {
    const customerId = 1; // This should come from authenticated user
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_method,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = $1
    `;

    const params = [customerId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: {
        orders: result.rows
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = 1; // This should come from authenticated user

    // Get order details
    const orderResult = await db.query(`
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.id
      WHERE o.id = $1 AND o.customer_id = $2
    `, [id, customerId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image,
        s.name as store_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE oi.order_id = $1
    `, [id]);

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          shipping_address: JSON.parse(order.shipping_address || '{}')
        },
        items: itemsResult.rows
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلب'
    });
  }
});

// Update order status
router.patch('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      data: {
        order: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة الطلب'
    });
  }
});

export default router;