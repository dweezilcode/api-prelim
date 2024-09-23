require('rootpath')();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./_middleware/logger'); // Import the logger
const authenticateToken = require('./_middleware/auth.middleware'); // Import the authentication middleware

dotenv.config();

const app = express();
const errorHandler = require('./_middleware/error-handler');
const authRoutes = require('./auth/auth.routes'); 
const usersController = require('./users/users.controller');
const activityController = require('./users/activity.controller'); 
const productController = require('./products/product.controller');
const inventoryController = require('./inventory/inventory.controller');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', authenticateToken, usersController); // Protect user management routes
app.use('/api/users/:userId/activity', activityController); // Nesting activity routes under user ID
app.use('/api/products', authenticateToken, productController); // Protect product management routes
app.use('/api/inventory', authenticateToken, inventoryController); // Protect inventory management routes

// Global Error Handler Middleware
app.use(errorHandler);

// Server Initialization
const jwtSecret = process.env.JWT_SECRET;
const dbHost = process.env.DB_HOST;
const port = process.env.PORT || 4000;

if (!jwtSecret || !dbHost) {
    logger.error('Missing required environment variables.');
    process.exit(1);
}

logger.info(`JWT Secret: ${jwtSecret}`);
logger.info(`Database Host: ${dbHost}`);
logger.info(`Server running on port ${port}`);

app.listen(port, () => logger.info(`Server listening on port ${port}`));
