const express = require('express');
const router = express.Router();
const inventoryService = require('./inventory.service');
const logger = require('../_middleware/logger');
const { body, param, validationResult } = require('express-validator');
const db = require('../_helpers/db'); // Ensure correct path to db.js
const Inventory = db.Inventory; // Access Inventory from db object

// Middleware to validate request body for updating inventory
const validateUpdateInventory = [
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
];

// Middleware to validate request params for checking stock availability
const validateCheckStockAvailability = [
    param('productId').isInt().withMessage('Product ID must be an integer'),
];

// POST /api/inventory - Update inventory
router.post('/', validateUpdateInventory, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { productId, quantity } = req.body;
        // Use Inventory model for updating stock
        await Inventory.update({ quantity }, { where: { id: productId } });
        res.json({ message: 'Inventory updated successfully' });
    } catch (error) {
        logger.error('Error updating inventory:', error);
        next(error);
    }
});

// GET /api/products/:productId/availability - Check stock availability
router.get('/availability/:productId', validateCheckStockAvailability, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const availability = await Inventory.findOne({ where: { id: req.params.productId } });
        res.json({ available: availability ? availability.quantity > 0 : false });
    } catch (error) {
        logger.error('Error checking stock availability:', error);
        next(error);
    }
});

module.exports = router;
