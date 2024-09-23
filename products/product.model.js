const { DataTypes } = require('sequelize');
const logger = require('../_middleware/logger');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('active', 'deleted'), defaultValue: 'active' }
    });

    // Log creation event
    Product.addHook('afterCreate', (product) => {
        logger.info(`Product created: ID ${product.id}, Name: ${product.name}`);
    });

    // Log update event
    Product.addHook('afterUpdate', (product) => {
        logger.info(`Product updated: ID ${product.id}, Name: ${product.name}`);
    });

    // Log deletion event
    Product.addHook('afterDestroy', (product) => {
        logger.info(`Product deleted: ID ${product.id}, Name: ${product.name}`);
    });

    return Product;
};
