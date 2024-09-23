const { DataTypes } = require('sequelize');
const sequelize = require('../_helpers/db');

// Define the Product model
const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL, allowNull: false },
});

module.exports = Product;