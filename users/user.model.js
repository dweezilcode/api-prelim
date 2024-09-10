const { DataTypes } = require('sequelize');

module.exports = defineUserModel;

function defineUserModel(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
        dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        dateLastLoggedIn: { type: DataTypes.DATE, allowNull: true },
        themeColor: { type: DataTypes.STRING, allowNull: true, defaultValue: 'light' },
        emailNotifications: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
        language: { type: DataTypes.STRING, allowNull: true, defaultValue: 'en' }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            withHash: { attributes: {} }
        }
    };

    return sequelize.define('User', attributes, options);
}
