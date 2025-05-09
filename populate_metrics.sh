#!/bin/bash

# Script to populate metrics for E-commerce API Dashboard
echo "Starting to populate metrics for dashboard..."
echo "This will make multiple API calls to generate diverse metrics data."

# Base URL - change if using different port
BASE_URL="http://localhost:3000"

# Product Entity Operations (Create, Read, Update, Delete)
echo "Generating product entity metrics..."

# Create products (DB create operations)
echo "Creating products..."
curl -s -X POST "$BASE_URL/api/enhanced-products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Mouse","price":59.99,"stock":45,"category":"Gaming","userId":101,"userName":"Alice"}'
echo ""

curl -s -X POST "$BASE_URL/api/enhanced-products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Keyboard","price":79.99,"stock":30,"category":"Computing","userId":102,"userName":"Bob"}'
echo ""

curl -s -X POST "$BASE_URL/api/enhanced-products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Premium Headset","price":129.99,"stock":25,"category":"Audio","userId":103,"userName":"Charlie"}'
echo ""

# Read products (DB read operations)
echo "Reading products..."
curl -s "$BASE_URL/api/enhanced-products?userId=104&userName=Dave"
echo ""

for id in {1..3}; do
  curl -s "$BASE_URL/api/enhanced-products/$id?userId=105&userName=Eve"
  echo ""
  sleep 0.3
done

# Update products (DB update operations)
echo "Updating products..."
curl -s -X PUT "$BASE_URL/api/enhanced-products/1" \
  -H "Content-Type: application/json" \
  -d '{"price":54.99,"stock":40,"userId":106,"userName":"Frank"}'
echo ""

curl -s -X PUT "$BASE_URL/api/enhanced-products/2" \
  -H "Content-Type: application/json" \
  -d '{"price":74.99,"stock":25,"userId":107,"userName":"Grace"}'
echo ""

# Delete product (DB delete operations)
echo "Deleting product..."
curl -s -X DELETE "$BASE_URL/api/enhanced-products/3?userId=108&userName=Hannah"
echo ""

# Order Entity Operations
echo "Generating order entity metrics..."

# Create orders (DB create operations)
echo "Creating orders..."
curl -s -X POST "$BASE_URL/api/enhanced-orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":109,"userName":"Ivan","products":[{"productId":1,"quantity":2}],"totalAmount":109.98}'
echo ""

curl -s -X POST "$BASE_URL/api/enhanced-orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":110,"userName":"Julie","products":[{"productId":2,"quantity":1}],"totalAmount":74.99}'
echo ""

# Read orders (DB read operations)
echo "Reading orders..."
curl -s "$BASE_URL/api/enhanced-orders?userId=111&userName=Kevin"
echo ""

curl -s "$BASE_URL/api/enhanced-orders/1?userId=112&userName=Linda"
echo ""

# Update order status (DB update operations)
echo "Updating order status..."
curl -s -X PATCH "$BASE_URL/api/enhanced-orders/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"Processing","userId":113,"userName":"Mike"}'
echo ""

curl -s -X PATCH "$BASE_URL/api/enhanced-orders/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"Shipped","userId":114,"userName":"Nancy"}'
echo ""

curl -s -X PATCH "$BASE_URL/api/enhanced-orders/2/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"Delivered","userId":115,"userName":"Oscar"}'
echo ""

# User Activity Metrics
echo "Generating user activity metrics..."

# Browse products activity
echo "Simulating browse products activity..."
for i in {1..8}; do
  curl -s "$BASE_URL/api/enhanced-products?userId=116&userName=Pam&activity_type=browse_products"
  echo ""
  sleep 0.2
done

# View specific products
echo "Simulating product view activity..."
for id in {1..2}; do
  curl -s "$BASE_URL/api/enhanced-products/$id?userId=117&userName=Quinn&activity_type=view_product"
  echo ""
  sleep 0.3
done

# Product category browsing
echo "Simulating category browsing..."
CATEGORIES=("Electronics" "Gaming" "Computing" "Audio")
for category in "${CATEGORIES[@]}"; do
  curl -s "$BASE_URL/api/enhanced-products?category=$category&userId=118&userName=Rachel&activity_type=browse_category"
  echo ""
  sleep 0.3
done

# Add to cart activities
echo "Simulating add to cart activity..."
for id in {1..2}; do
  curl -s -X POST "$BASE_URL/api/cart/user/118/product" \
    -H "Content-Type: application/json" \
    -d "{\"productId\":$id,\"quantity\":1,\"userId\":118,\"userName\":\"Rachel\"}"
  echo ""
  sleep 0.3
done

# Place order activities
echo "Simulating order placement..."
curl -s -X POST "$BASE_URL/api/enhanced-orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":119,"userName":"Steve","products":[{"productId":1,"quantity":1},{"productId":2,"quantity":1}],"totalAmount":129.98}'
echo ""

sleep 0.5

curl -s -X POST "$BASE_URL/api/enhanced-orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":120,"userName":"Terry","products":[{"productId":1,"quantity":2}],"totalAmount":109.98}'
echo ""

# Check order status activities
echo "Simulating order status checking..."
for id in {1..3}; do
  curl -s "$BASE_URL/api/enhanced-orders/$id?userId=121&userName=Uma&activity_type=check_order"
  echo ""
  sleep 0.3
done

# Generate additional metrics in a loop for time-series data
echo "Generating time-series data points..."
for i in {1..5}; do
  echo "Batch $i of 5..."
  
  # Random product views
  for id in {1..2}; do
    curl -s "$BASE_URL/api/enhanced-products/$id?userId=$((122+i))&userName=User$i"
    echo ""
    sleep 0.2
  done
  
  # Random order creations
  if [ $((i % 2)) -eq 0 ]; then
    curl -s -X POST "$BASE_URL/api/enhanced-orders" \
      -H "Content-Type: application/json" \
      -d "{\"userId\":$((130+i)),\"userName\":\"Customer$i\",\"products\":[{\"productId\":1,\"quantity\":1}],\"totalAmount\":54.99}"
    echo ""
  fi
  
  # Random status updates
  if [ $((i % 3)) -eq 0 ]; then
    STATUSES=("Processing" "Shipped" "Delivered")
    status_index=$((i % 3))
    curl -s -X PATCH "$BASE_URL/api/enhanced-orders/1/status" \
      -H "Content-Type: application/json" \
      -d "{\"status\":\"${STATUSES[$status_index]}\",\"userId\":$((140+i)),\"userName\":\"Admin$i\"}"
    echo ""
  fi
  
  sleep 1
done

echo "Metrics population complete! Check your Grafana dashboard for results."
