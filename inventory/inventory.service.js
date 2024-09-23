const db = require('../_helpers/db');
const logger = require('../_middleware/logger');

async function updateInventory(productId, quantity) {
    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (inventory) {
        inventory.quantity += quantity;
        return await inventory.save();
    } else {
        return await db.Inventory.create({ productId, quantity });
    }
}

async function checkStockAvailability(productId) {
    const inventory = await db.Inventory.findOne({ where: { productId } });
    return inventory ? inventory.quantity : 0;
}

module.exports = { updateInventory, checkStockAvailability };
