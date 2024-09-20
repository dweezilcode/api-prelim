const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Product', {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('active', 'deleted'), defaultValue: 'active' }
    }, {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            // Add scopes if needed
        },
        indexes: [
            { unique: false, fields: ['name'] },
            { unique: false, fields: ['status'] }
        ]
    });
};