const { DataTypes } = require('sequelize');

// Define the Product model
module.exports = (sequelize) => {
    return sequelize.define('Product', {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        price: { type: DataTypes.DECIMAL, allowNull: false },
        stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    });
};
