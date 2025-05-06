// src/routes/enhanced-orders.js
const express = require('express');
const router = express.Router();
const { metrics } = require('../middleware/enhanced-metrics');

// In-memory orders database
let orders = [
  {
    id: 1,
    userId: 101,
    userName: 'Alice Smith',
    products: [
      { productId: 1, productName: 'Smartphone', quantity: 2 },
      { productId: 3, productName: 'Headphones', quantity: 1 }
    ],
    totalAmount: 1549.97,
    status: 'Delivered',
    createdAt: '2025-04-25T10:30:00Z'
  },
  {
    id: 2,
    userId: 102,
    userName: 'Bob Johnson',
    products: [
      { productId: 2, productName: 'Laptop', quantity: 1 },
      { productId: 4, productName: 'Coffee Maker', quantity: 1 }
    ],
    totalAmount: 1389.98,
    status: 'Processing',
    createdAt: '2025-05-01T15:45:00Z'
  }
];

// Get all orders
router.get('/', (req, res) => {
  const start = process.hrtime();
  
  try {
    // Simulate database operation latency
    setTimeout(() => {
      // Track user activity if user info provided
      if (req.query.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.query.userId,
          user_name: req.query.userName || 'anonymous',
          activity_type: 'view_orders'
        });
      }
      
      res.json(orders);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'order' }, duration);
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    // Simulate database operation latency
    setTimeout(() => {
      const order = orders.find(o => o.id === parseInt(req.params.id));
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Track user activity if user info provided
      if (req.query.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.query.userId,
          user_name: req.query.userName || 'anonymous',
          activity_type: 'view_order_details'
        });
      }
      
      res.json(order);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'order' }, duration);
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', (req, res) => {
  const start = process.hrtime();
  
  try {
    const { userId, userName, products, totalAmount } = req.body;
    
    // Validate request
    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Simulate database operation latency
    setTimeout(() => {
      // Enhance products with names (in a real app, you'd look these up)
      const enhancedProducts = products.map(p => {
        // This is simplified - in a real app, you'd fetch product details from DB
        const productName = `Product ${p.productId}`;
        return { ...p, productName };
      });
      
      const newOrder = {
        id: orders.length + 1,
        userId,
        userName: userName || `User ${userId}`,
        products: enhancedProducts,
        totalAmount,
        status: 'Processing',
        createdAt: new Date().toISOString()
      };
      
      orders.push(newOrder);
      
      // Record detailed order metrics
      metrics.orderPlacedCounter.inc({
        order_id: newOrder.id.toString(),
        user_id: newOrder.userId.toString(),
        user_name: newOrder.userName,
        total_amount: newOrder.totalAmount.toString(),
        product_count: newOrder.products.length.toString()
      });
      
      // Record initial order status
      metrics.orderStatusCounter.inc({
        order_id: newOrder.id.toString(),
        status: newOrder.status
      });
      
      // Track user activity
      metrics.userActivityCounter.inc({
        user_id: newOrder.userId.toString(),
        user_name: newOrder.userName,
        activity_type: 'place_order'
      });
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'create', entity: 'order' }, duration);
      
      res.status(201).json(newOrder);
    }, Math.random() * 300);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.patch('/:id/status', (req, res) => {
  const start = process.hrtime();
  
  try {
    const { status } = req.body;
    const id = parseInt(req.params.id);
    
    if (!status) {
      return res.status(400).json({ message: 'Please provide a status' });
    }
    
    // Simulate database operation latency
    setTimeout(() => {
      const orderIndex = orders.findIndex(o => o.id === id);
      
      if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const previousStatus = orders[orderIndex].status;
      orders[orderIndex].status = status;
      
      // Record status change metrics
      metrics.orderStatusCounter.inc({
        order_id: id.toString(),
        status: status
      });
      
      // Track user activity if user info provided
      if (req.body.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.body.userId,
          user_name: req.body.userName || 'admin',
          activity_type: 'update_order_status'
        });
      }
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'update', entity: 'order' }, duration);
      
      res.json({
        ...orders[orderIndex],
        previousStatus
      });
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper to calculate duration in seconds
const getDurationInSeconds = (start) => {
  const diff = process.hrtime(start);
  return (diff[0] * 1e9 + diff[1]) / 1e9;
};

module.exports = router;