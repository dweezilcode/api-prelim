const { DataTypes } = require('sequelize');
const sequelize = require('../_helpers/db');

// Define the User model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'customer' },
});

module.exports = User;