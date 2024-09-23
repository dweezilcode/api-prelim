const { DataTypes } = require('sequelize');
const logger = require('../_middleware/logger');

module.exports = (sequelize) => {
    const Inventory = sequelize.define('Inventory', {
        productId: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            unique: true, // Ensure each product has a unique inventory record
            references: {
                model: 'Products', // Assuming your products table is named 'Products'
                key: 'id'
            }
        },
        quantity: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            defaultValue: 0 // Default quantity to 0 if not provided
        }
    });

    // Log creation event
    Inventory.addHook('afterCreate', (inventory) => {
        logger.info(`Inventory created: Product ID ${inventory.productId}, Quantity: ${inventory.quantity}`);
    });

    // Log update event
    Inventory.addHook('afterUpdate', (inventory) => {
        logger.info(`Inventory updated: Product ID ${inventory.productId}, Quantity: ${inventory.quantity}`);
    });

    // Log deletion event
    Inventory.addHook('afterDestroy', (inventory) => {
        logger.info(`Inventory deleted: Product ID ${inventory.productId}`);
    });

    return Inventory;
};
