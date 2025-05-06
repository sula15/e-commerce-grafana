// src/routes/users.js
const express = require('express');
const router = express.Router();
const { metrics } = require('../middleware/enhanced-metrics');

// In-memory users database for demo
let users = [
  { id: 101, name: 'Alice Smith', email: 'alice@example.com', role: 'customer', active: true },
  { id: 102, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', active: true },
  { id: 103, name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin', active: true }
];

// Track active users
let activeUsers = users.filter(user => user.active).length;
metrics.activeUsersGauge.set(activeUsers);

// Get all users
router.get('/', (req, res) => {
  const start = process.hrtime();
  
  try {
    // Simulate database operation latency
    setTimeout(() => {
      // Only return non-sensitive info
      const safeUsers = users.map(({ id, name, role, active }) => ({ id, name, role, active }));
      res.json(safeUsers);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'user' }, duration);
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    // Simulate database operation latency
    setTimeout(() => {
      const user = users.find(u => u.id === parseInt(req.params.id));
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Only return non-sensitive info
      const { id, name, role, active } = user;
      res.json({ id, name, role, active });
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'read', entity: 'user' }, duration);
    }, Math.random() * 100);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/', (req, res) => {
  const start = process.hrtime();
  
  try {
    const { name, email, role = 'customer' } = req.body;
    
    // Validate request
    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email' });
    }
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    // Simulate database operation latency
    setTimeout(() => {
      const newUser = {
        id: users.length + 100 + 1, // Just for demo
        name,
        email,
        role,
        active: true
      };
      
      users.push(newUser);
      
      // Update active users count
      activeUsers++;
      metrics.activeUsersGauge.set(activeUsers);
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'create', entity: 'user' }, duration);
      
      // Only return non-sensitive info
      const { id, name: userName, role: userRole, active } = newUser;
      res.status(201).json({ id, name: userName, role: userRole, active });
    }, Math.random() * 200);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    const { name, email, role } = req.body;
    const id = parseInt(req.params.id);
    
    // Simulate database operation latency
    setTimeout(() => {
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if email already exists and is not this user's
      if (email && email !== users[userIndex].email && users.some(u => u.email === email)) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      
      const updatedUser = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        role: role || users[userIndex].role
      };
      
      users[userIndex] = updatedUser;
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'update', entity: 'user' }, duration);
      
      // Only return non-sensitive info
      const { id, name: userName, role: userRole, active } = updatedUser;
      res.json({ id, name: userName, role: userRole, active });
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Deactivate user (soft delete)
router.delete('/:id', (req, res) => {
  const start = process.hrtime();
  
  try {
    const id = parseInt(req.params.id);
    
    // Simulate database operation latency
    setTimeout(() => {
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Just mark as inactive instead of deleting
      if (users[userIndex].active) {
        users[userIndex].active = false;
        
        // Update active users count
        activeUsers--;
        metrics.activeUsersGauge.set(activeUsers);
      }
      
      // Record DB operation duration
      const duration = getDurationInSeconds(start);
      metrics.dbOperationDuration.observe({ operation: 'update', entity: 'user' }, duration);
      
      res.status(200).json({ message: 'User deactivated successfully' });
    }, Math.random() * 150);
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper to calculate duration in seconds
const getDurationInSeconds = (start) => {
  const diff = process.hrtime(start);
  return (diff[0] * 1e9 + diff[1]) / 1e9;
};

module.exports = router;