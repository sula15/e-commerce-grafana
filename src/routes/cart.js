// src/routes/cart.js
const express = require('express');
const router = express.Router();
const { metrics } = require('../middleware/enhanced-metrics');

// In-memory cart database for demo
let carts = [
  {
    id: 1,
    userId: 101,
    products: [
      { productId: 1, quantity: 1 },
      { productId: 3, quantity: 2 }
    ],
    lastUpdated: '2025-05-03T09:15:00Z'
  },
  {
    id: 2,
    userId: 102,
    products: [
      { productId: 2, quantity: 1 }
    ],
    lastUpdated: '2025-05-04T14:30:00Z'
  }
];

// Get cart by user ID
router.get('/user/:userId', (req, res) => {
  const start = process.hrtime();
  
  try {
    const userId = parseInt(req.params.userId);
    
    // Simulate database operation latency
    setTimeout(() => {
      const cart = carts.find(c => c.userId === userId);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      res.json(cart);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'cart' }, duration);
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update cart
router.post('/user/:userId', (req, res) => {
  const start = process.hrtime();
  
  try {
    const userId = parseInt(req.params.userId);
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Please provide a valid products array' });
    }
    
    // Simulate database operation latency
    setTimeout(() => {
      let cart = carts.find(c => c.userId === userId);
      let isNewCart = false;
      
      if (!cart) {
        isNewCart = true;
        cart = {
          id: carts.length + 1,
          userId,
          products: [],
          lastUpdated: new Date().toISOString()
        };
      }
      
      // Update cart
      cart.products = products;
      cart.lastUpdated = new Date().toISOString();
      
      if (isNewCart) {
        carts.push(cart);
      }
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ 
        operation: isNewCart ? 'create' : 'update', 
        entity: 'cart' 
      }, duration);
      
      res.status(isNewCart ? 201 : 200).json(cart);
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product to cart
router.post('/user/:userId/product', (req, res) => {
  const start = process.hrtime();
  
  try {
    const userId = parseInt(req.params.userId);
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Please provide a valid productId' });
    }
    
    // Simulate database operation latency
    setTimeout(() => {
      let cart = carts.find(c => c.userId === userId);
      let isNewCart = false;
      
      if (!cart) {
        isNewCart = true;
        cart = {
          id: carts.length + 1,
          userId,
          products: [],
          lastUpdated: new Date().toISOString()
        };
        carts.push(cart);
      }
      
      // Check if product already exists in cart
      const productIndex = cart.products.findIndex(p => p.productId === parseInt(productId));
      
      if (productIndex > -1) {
        // Update quantity
        cart.products[productIndex].quantity += parseInt(quantity);
      } else {
        // Add new product
        cart.products.push({
          productId: parseInt(productId),
          quantity: parseInt(quantity)
        });
      }
      
      cart.lastUpdated = new Date().toISOString();
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ 
        operation: isNewCart ? 'create' : 'update', 
        entity: 'cart' 
      }, duration);
      
      res.json(cart);
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove product from cart
router.delete('/user/:userId/product/:productId', (req, res) => {
  const start = process.hrtime();
  
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    
    // Simulate database operation latency
    setTimeout(() => {
      const cart = carts.find(c => c.userId === userId);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      // Remove product
      cart.products = cart.products.filter(p => p.productId !== productId);
      cart.lastUpdated = new Date().toISOString();
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'update', entity: 'cart' }, duration);
      
      res.json(cart);
    }, Math.random() * 120);
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/user/:userId', (req, res) => {
  const start = process.hrtime();
  
  try {
    const userId = parseInt(req.params.userId);
    
    // Simulate database operation latency
    setTimeout(() => {
      const cart = carts.find(c => c.userId === userId);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      // Clear products
      cart.products = [];
      cart.lastUpdated = new Date().toISOString();
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'update', entity: 'cart' }, duration);
      
      res.json({ message: 'Cart cleared successfully' });
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper to calculate duration in seconds
const getDurationInSeconds = (start) => {
  const diff = process.hrtime(start);
  return (diff[0] * 1e9 + diff[1]) / 1e9;
};

module.exports = router;