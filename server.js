require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./_helpers/db');

// Import middleware
const authenticate = require('./_middleware/authenticate');
const authorize = require('./_middleware/role');

// Import controllers
const productController = require('./products/product.controller');
const inventoryController = require('./inventory/inventory.controller');
const userController = require('./users/user.controller'); // Correct path for user controller

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Public routes (Accessible by anyone)
app.post('/api/register', userController.register); // Add registration route
app.get('/api/products', productController.getAll);
app.get('/api/products/:id', productController.getById);
app.post('/api/login', userController.login); // Add login route

// Protected routes (Accessible by administrator/manager only)
app.post('/api/products', authenticate, authorize(['administrator', 'manager']), productController.create);
app.put('/api/products/:id', authenticate, authorize(['administrator', 'manager']), productController.update);
app.delete('/api/products/:id', authenticate, authorize(['administrator', 'manager']), productController.remove);

app.get('/api/inventory', authenticate, authorize(['administrator', 'manager']), inventoryController.getAll);
app.post('/api/inventory', authenticate, authorize(['administrator', 'manager']), inventoryController.update);

// Sync models and start the server
const PORT = process.env.PORT || 4000; // Change to 4000
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
