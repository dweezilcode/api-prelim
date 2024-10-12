const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    };

    const options = {
        timestamps: true
    };

    return sequelize.define('Inventory', attributes, options);
}

// Define the Inventory model
module.exports = (sequelize) => {
    return sequelize.define('Inventory', {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
    });
};

