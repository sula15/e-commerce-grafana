// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import metrics middleware
const { register, metricsMiddleware } = require('./middleware/enhanced-metrics');



// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(metricsMiddleware);

// Connect to MongoDB (if needed)
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const productRoutes = require('./routes/enhanced-products');
const orderRoutes = require('./routes/enhanced-orders');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

// Use routes
app.use('/api/enhanced-products', productRoutes);
app.use('/api/enhanced-orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API is running',
    endpoints: {
      metrics: '/metrics',
      health: '/health',
      products: '/api/enhanced-products',
      orders: '/api/enhanced-orders',
      users: '/api/users',
      cart: '/api/cart'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;