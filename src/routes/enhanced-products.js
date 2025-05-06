// src/routes/enhanced-products.js
const express = require('express');
const router = express.Router();
const { metrics } = require('../middleware/enhanced-metrics');

// In-memory products database for demo
let products = [
  { id: 1, name: 'Smartphone', price: 699.99, stock: 50, category: 'Electronics' },
  { id: 2, name: 'Laptop', price: 1299.99, stock: 25, category: 'Electronics' },
  { id: 3, name: 'Headphones', price: 149.99, stock: 100, category: 'Electronics' },
  { id: 4, name: 'Coffee Maker', price: 89.99, stock: 30, category: 'Home Appliances' },
  { id: 5, name: 'Running Shoes', price: 79.99, stock: 45, category: 'Sports' }
];

// Get all products
router.get('/', (req, res) => {
  const start = process.hrtime();
  
  try {
    // Simulate database operation latency
    setTimeout(() => {
      // Record user activity for analytics
      if (req.query.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.query.userId,
          user_name: req.query.userName || 'anonymous',
          activity_type: 'browse_products'
        });
      }
      
      res.json(products);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'product' }, duration);
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    // Simulate database operation latency
    setTimeout(() => {
      const product = products.find(p => p.id === parseInt(req.params.id));
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Record product view with product details for analytics
      metrics.productViewsCounter.inc({
        product_id: product.id.toString(),
        product_name: product.name,
        category: product.category,
        price: product.price.toString()
      });
      
      // Record user activity if user info provided
      if (req.query.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.query.userId,
          user_name: req.query.userName || 'anonymous',
          activity_type: 'view_product'
        });
      }
      
      res.json(product);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'product' }, duration);
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product
router.post('/', (req, res) => {
  const start = process.hrtime();
  
  try {
    const { name, price, stock, category } = req.body;
    
    // Validate request
    if (!name || !price || !stock || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Simulate database operation latency
    setTimeout(() => {
      const newProduct = {
        id: products.length + 1,
        name,
        price,
        stock,
        category
      };
      
      products.push(newProduct);
      
      // Increment product creation counter with product details
      metrics.productCreationCounter.inc({
        product_id: newProduct.id.toString(),
        product_name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price.toString()
      });
      
      // Record user activity if user info provided
      if (req.body.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.body.userId,
          user_name: req.body.userName || 'admin',
          activity_type: 'create_product'
        });
      }
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'create', entity: 'product' }, duration);
      
      res.status(201).json(newProduct);
    }, Math.random() * 200);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    const { name, price, stock, category } = req.body;
    const id = parseInt(req.params.id);
    
    // Simulate database operation latency
    setTimeout(() => {
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const updatedProduct = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        price: price || products[productIndex].price,
        stock: stock || products[productIndex].stock,
        category: category || products[productIndex].category
      };
      
      products[productIndex] = updatedProduct;
      
      // Record user activity if user info provided
      if (req.body.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.body.userId,
          user_name: req.body.userName || 'admin',
          activity_type: 'update_product'
        });
      }
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'update', entity: 'product' }, duration);
      
      res.json(updatedProduct);
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    const id = parseInt(req.params.id);
    
    // Simulate database operation latency
    setTimeout(() => {
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const deletedProduct = products[productIndex];
      products = products.filter(p => p.id !== id);
      
      // Record user activity if user info provided
      if (req.query.userId) {
        metrics.userActivityCounter.inc({
          user_id: req.query.userId,
          user_name: req.query.userName || 'admin',
          activity_type: 'delete_product'
        });
      }
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'delete', entity: 'product' }, duration);
      
      res.status(204).end();
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper to calculate duration in seconds
const getDurationInSeconds = (start) => {
  const diff = process.hrtime(start);
  return (diff[0] * 1e9 + diff[1]) / 1e9;
};

module.exports = router;