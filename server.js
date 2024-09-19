require('rootpath')(); // Ensure the root path is set correctly
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv to load environment variables
dotenv.config(); // Load environment variables from the .env file

const app = express();
const errorHandler = require('./_middleware/error-handler'); // Adjust the path as needed
const usersController = require('./users/users.controller'); // Users controller
const activityController = require('./activity/activity.controller'); // Activity controller
const productController = require('./products/product.controller'); // Product controller

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Routes
app.use('/api/users', usersController); // User routes
app.use('/api/activity', activityController); // Activity routes
app.use('/api/products', productController); // Product routes

// Global Error Handler Middleware
app.use(errorHandler); // Handle errors globally

// Server Initialization
const jwtSecret = process.env.JWT_SECRET;
const dbHost = process.env.DB_HOST;
const port = process.env.PORT || 4000;

console.log(`JWT Secret: ${jwtSecret}`);
console.log(`Database Host: ${dbHost}`);
console.log(`Server running on port ${port}`);

app.listen(port, () => console.log(`Server listening on port ${port}`));