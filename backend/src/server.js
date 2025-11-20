const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/inventory', inventoryRoutes);

// Error handling middleware
// FIX 1: Changed 'next' to '_next' to satisfy no-unused-vars
app.use((err, req, res, _next) => {
  // FIX 2: Added comment to ignore console warning
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // FIX 2: Added comments to ignore console warnings
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;