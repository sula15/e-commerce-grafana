# E-commerce API with Enhanced Metrics Monitoring

This project implements a RESTful e-commerce API service with advanced Prometheus metrics and Grafana visualization for business intelligence. It demonstrates how to implement observability in a Node.js application with detailed business metrics.

## Project Overview

The application consists of:

1. **E-commerce REST API** - A Node.js/Express service with endpoints for products, orders, users, and shopping carts
2. **Enhanced Metrics** - Business-oriented metrics capturing detailed information about products, users, and orders
3. **Prometheus Integration** - Metrics collection and storage
4. **Grafana Dashboard** - Visualization with drill-down capabilities for business insights

## Components

### API Service
- Built with Node.js and Express
- In-memory data storage for demonstration purposes
- RESTful endpoints for e-commerce operations

### Metrics Collection
- HTTP request metrics (counts, duration, status codes)
- Business metrics (product views, orders, user activity)
- Performance metrics (database operation duration)

### Monitoring Stack
- Prometheus for metrics storage and querying
- Grafana for visualization and alerting

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (if running locally)

### Installation and Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd e-commerce-api
```

2. Start the application with Docker Compose:
```bash
docker-compose up -d
```

3. Access the services:
   - API: http://localhost:3000
   - Prometheus: http://localhost:9091
   - Grafana: http://localhost:3001 (login: admin/password)

## Project Structure

```
e-commerce-api/
├── docker-compose.yml          # Docker composition for all services
├── Dockerfile                  # For the Node.js application
├── src/
│   ├── index.js                # Main application entry point
│   ├── middleware/
│   │   └── enhanced-metrics.js # Enhanced metrics middleware
│   ├── routes/
│       ├── enhanced-products.js # Product routes with enhanced metrics
│       ├── enhanced-orders.js   # Order routes with enhanced metrics
│       ├── users.js             # User management routes
│       └── cart.js              # Cart management routes
├── prometheus/
│   └── prometheus.yml          # Prometheus configuration
└── grafana/
    ├── dashboards/             # Grafana dashboard JSON
    └── provisioning/           # Grafana provisioning configuration
```

## API Endpoints

### Products
- `GET /api/enhanced-products` - List all products
- `GET /api/enhanced-products/:id` - Get a specific product
- `POST /api/enhanced-products` - Create a new product
- `PUT /api/enhanced-products/:id` - Update a product
- `DELETE /api/enhanced-products/:id` - Delete a product

### Orders
- `GET /api/enhanced-orders` - List all orders
- `GET /api/enhanced-orders/:id` - Get a specific order
- `POST /api/enhanced-orders` - Create a new order
- `PATCH /api/enhanced-orders/:id/status` - Update order status

### Users and Cart
- Standard CRUD operations for user management and shopping cart

### Metrics
- `GET /metrics` - Prometheus metrics endpoint

## Enhanced Metrics

The application collects the following business metrics:

- **Product Metrics**
  - Product views by ID, name, category, and price
  - Product creations with full details
  
- **Order Metrics**
  - Orders placed with customer and value information
  - Order status changes
  
- **User Metrics**
  - User activity by type (browsing, purchasing, etc.)
  - Active users count

- **Performance Metrics**
  - HTTP request duration by endpoint
  - Database operation duration by entity and operation type

## Dashboard Features

The Grafana dashboard provides:

1. **Overview Metrics** - Technical and business KPIs
2. **Product Insights** - Detailed product analytics
3. **User Activity** - Customer behavior analysis
4. **Order Analytics** - Order processing metrics
5. **Error Analysis** - Error rates and details

The dashboard includes powerful filtering capabilities:
- HTTP Method (GET, POST, etc.)
- API Route
- Entity (product, order, user, cart)
- Product Category
- Activity Type
- Order Status

## Usage Examples

### Creating Products with Different Categories

```bash
# Add a Book product
curl -X POST "http://localhost:3000/api/enhanced-products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fantasy Novel","price":19.99,"stock":100,"category":"Books","userId":101,"userName":"Alice"}'

# Add a Clothing product
curl -X POST "http://localhost:3000/api/enhanced-products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Winter Jacket","price":89.99,"stock":35,"category":"Clothing"}'
```

### Viewing Products (Generates View Metrics)

```bash
# View a product with user context (generates metrics)
curl "http://localhost:3000/api/enhanced-products/1?userId=101&userName=Alice"
```

### Creating Orders

```bash
# Create a new order
curl -X POST "http://localhost:3000/api/enhanced-orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":102,"userName":"Bob","products":[{"productId":1,"quantity":2}],"totalAmount":1399.98}'
```

## Troubleshooting

If you encounter issues:

1. Check container logs:
```bash
docker-compose logs api
docker-compose logs prometheus
docker-compose logs grafana
```

2. Verify metrics are being generated:
   - Check Prometheus UI (http://localhost:9091)
   - Try queries like `ecommerce_product_views_total`

3. For dashboard issues:
   - Check the time range in Grafana
   - Verify template variables aren't filtering out data

## License

[MIT License](LICENSE)
