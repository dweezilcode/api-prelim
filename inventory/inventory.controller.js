const express = require('express');
const router = express.Router();
const { Inventory } = require('_helpers/db');
const authorize = require('_middleware/authorize');

// View current inventory (Admin/Manager)
// View inventory (Admin/Manager)
router.get('/', authorize(['Admin', 'Manager']), async (req, res, next) => {
    try {
        const inventory = await Inventory.findAll(); // Assuming you have an Inventory model
        res.json(inventory);
    } catch (error) {
        console.error('Error retrieving inventory:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Update inventory stock (Admin/Manager)
router.post('/', authorize(['Admin', 'Manager']), async (req, res, next) => {
    const { productId, quantity } = req.body;
    let inventory = await Inventory.findOne({ where: { productId } });

    if (inventory) {
        // Update existing stock
        inventory.quantity += quantity;
        await inventory.save();
    } else {
        // Create new inventory record
        inventory = await Inventory.create({ productId, quantity });
    }
    
    res.status(200).json(inventory);
});

// Check stock availability for customers
router.get('/:productId/availability', async (req, res, next) => {
    const inventory = await Inventory.findOne({ where: { productId: req.params.productId } });
    if (!inventory || inventory.quantity <= 0) return res.status(404).json({ message: 'Out of stock' });

    res.json({ productId: req.params.productId, available: inventory.quantity });
});

module.exports = router;
