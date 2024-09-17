const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        dateCreated: { type: DataTypes.DATE, allowNull: false },
        dateLastLoggedIn: { type: DataTypes.DATE, allowNull: true }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            withHash: { attributes: {} }
        },
        indexes: [
            {
                unique: false,
                fields: ['email']
            },
            {
                unique: false,
                fields: ['role']
            },
            {
                unique: false,
                fields: ['status']
            },
            {
                unique: false,
                fields: ['dateCreated']
            },
            {
                unique: false,
                fields: ['dateLastLoggedIn']
            }
        ]
    };

    return sequelize.define('User', attributes, options);
}
//s