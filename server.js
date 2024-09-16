require('rootpath')();  // Ensure this is used correctly, typically to set the root path for module imports
require('dotenv').config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
const userRoutes = require('./users/users.controller');

// Validate environment variables
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Missing environment variables');
}

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging user activities
app.use(async (req, res, next) => {
    if (req.userId) { // Ensure req.userId is set (e.g., by authentication middleware)
        const logEntry = {
            actionType: req.method, // HTTP method as action type (customize if needed)
            timestamp: new Date().toISOString(),
            ipAddress: req.ip,
            browserInfo: req.headers['user-agent']
        };
        try {
            await userService.logUserActivity(req.userId, logEntry.actionType, logEntry.ipAddress, logEntry.browserInfo); // Log the activity
        } catch (error) {
            console.error('Failed to log user activity:', error);
        }
    }
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

// Error handling middleware (should be the last middleware)
app.use(errorHandler);  // Custom error handling middleware

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Current working directory:', process.cwd());
    console.log('Error handler path:', require.resolve('_middleware/error-handler'));
});