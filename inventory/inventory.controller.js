const inventoryService = require('./inventory.service');

// Get all inventory
async function getAll(req, res) {
    try {
        const inventory = await inventoryService.getAll();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving inventory', error: error.message });
    }
}

// Update inventory
async function update(req, res) {
    try {
        await inventoryService.update(req.body);
        res.json({ message: 'Inventory updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating inventory', error: error.message });
    }
}

module.exports = { getAll, update };