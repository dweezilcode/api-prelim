const { DataTypes } = require('sequelize');

// Define the Inventory model
module.exports = (sequelize) => {
    return sequelize.define('Inventory', {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
    });
};
