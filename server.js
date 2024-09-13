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