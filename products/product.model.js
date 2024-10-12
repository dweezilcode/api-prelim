const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' }, // Can be 'active' or 'deleted'
        stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    };

    const options = {
        timestamps: true
    };

    return sequelize.define('Product', attributes, options);
}
