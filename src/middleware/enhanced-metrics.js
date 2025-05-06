// src/middleware/enhanced-metrics.js
const promClient = require('prom-client');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add a default label to all metrics
promClient.collectDefaultMetrics({
  register,
  prefix: 'ecommerce_'
});

// Base HTTP metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Enhanced business metrics
const productViewsCounter = new promClient.Counter({
  name: 'ecommerce_product_views_total',
  help: 'Total number of product views',
  labelNames: ['product_id', 'product_name', 'category', 'price']
});

const productCreationCounter = new promClient.Counter({
  name: 'ecommerce_product_creations_total',
  help: 'Total number of products created',
  labelNames: ['product_id', 'product_name', 'category', 'price']
});

const orderPlacedCounter = new promClient.Counter({
  name: 'ecommerce_order_placed_total',
  help: 'Total number of orders placed',
  labelNames: ['order_id', 'user_id', 'user_name', 'total_amount', 'product_count']
});

const orderStatusCounter = new promClient.Counter({
  name: 'ecommerce_order_status_total',
  help: 'Count of orders by status',
  labelNames: ['order_id', 'status']
});

const userActivityCounter = new promClient.Counter({
  name: 'ecommerce_user_activity_total',
  help: 'Total activities by users',
  labelNames: ['user_id', 'user_name', 'activity_type']
});

const cartOperationsCounter = new promClient.Counter({
  name: 'ecommerce_cart_operations_total',
  help: 'Cart operations (add/remove)',
  labelNames: ['user_id', 'product_id', 'product_name', 'operation']
});

const activeUsersGauge = new promClient.Gauge({
  name: 'ecommerce_active_users',
  help: 'Number of active users'
});

// Database operation metrics
const dbOperationDuration = new promClient.Histogram({
  name: 'ecommerce_db_operation_duration_seconds',
  help: 'Duration of database operations in seconds',
  labelNames: ['operation', 'entity'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Register all metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCounter);
register.registerMetric(productViewsCounter);
register.registerMetric(productCreationCounter);
register.registerMetric(orderPlacedCounter);
register.registerMetric(orderStatusCounter);
register.registerMetric(userActivityCounter);
register.registerMetric(cartOperationsCounter);
register.registerMetric(activeUsersGauge);
register.registerMetric(dbOperationDuration);

// Middleware to collect HTTP metrics
const metricsMiddleware = (req, res, next) => {
  // Record start time
  const start = process.hrtime();
  
  // Record end time on response finish event
  res.on('finish', () => {
    const durationInSeconds = getDurationInSeconds(start);
    const route = req.route ? req.route.path : req.path;
    
    // Increment the request counter
    httpRequestCounter.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    // Record request duration
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: route,
        status_code: res.statusCode
      },
      durationInSeconds
    );
  });
  
  next();
};

// Helper to calculate duration in seconds
const getDurationInSeconds = (start) => {
  const diff = process.hrtime(start);
  return (diff[0] * 1e9 + diff[1]) / 1e9;
};

// Export metrics and middleware
module.exports = {
  register,
  metricsMiddleware,
  metrics: {
    productViewsCounter,
    productCreationCounter,
    orderPlacedCounter,
    orderStatusCounter,
    userActivityCounter,
    cartOperationsCounter,
    activeUsersGauge,
    dbOperationDuration
  }
};