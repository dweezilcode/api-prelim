const { DataTypes } = require('sequelize');
const sequelize = require('../_helpers/db');

// Define the Inventory model
const Inventory = sequelize.define('Inventory', {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
});

// Optional: Define associations if you have a Product model
// Inventory.associate = (models) => {
//     Inventory.belongsTo(models.Product, { foreignKey: 'productId' });
// };

module.exports = Inventory;