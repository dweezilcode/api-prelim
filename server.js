require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

// Import middleware
const authenticate = require('./_middleware/authenticate');
const authorize = require('./_middleware/authorize'); // Correct path to authorize.js

// Import controllers
const userController = require('./users/user.controller');
const productController = require('./products/product.controller');
const inventoryController = require('./inventory/inventory.controller');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// Public routes
app.post('/api/register', userController.register);
app.post('/api/login', userController.login);
app.get('/api/products', productController.getAll);
app.get('/api/products/:id', productController.getById);

// Protected routes (Administrator/Manager only)
app.post('/api/products', authenticate, authorize(['administrator', 'manager']), productController.create);
app.put('/api/products/:id', authenticate, authorize(['administrator', 'manager']), productController.update);
app.delete('/api/products/:id', authenticate, authorize(['administrator', 'manager']), productController.remove);
app.get('/api/products/:id/availability', productController.checkAvailability);
app.get('/api/inventory', authenticate, authorize(['administrator', 'manager']), inventoryController.getAll);
app.post('/api/inventory', authenticate, authorize(['administrator', 'manager']), inventoryController.update);

// Swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// Global error handler
app.use(errorHandler);

// Start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
