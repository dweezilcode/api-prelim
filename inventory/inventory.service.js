const Inventory = require('./inventory.model');

// Get all inventory
async function getAll() {
    return await Inventory.findAll();
}

// Update inventory
async function update(inventoryData) {
    const inventory = await Inventory.findOne({ where: { productId: inventoryData.productId } });
    
    if (!inventory) {
        await Inventory.create(inventoryData);
    } else {
        inventory.quantity = inventoryData.quantity;
        await inventory.save();
    }
}

module.exports = { getAll, update };