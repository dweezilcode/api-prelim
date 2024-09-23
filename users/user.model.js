const { DataTypes } = require('sequelize');
const logger = require('../_middleware/logger');

module.exports = defineUserModel;

function defineUserModel(sequelize) {
    console.log('Defining User model...');
    const attributes = {
        username: { type: DataTypes.STRING, allowNull: true, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
        dateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
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
        },
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true, // Ensure username is unique
                fields: ['username']
            },
            {
                unique: false,
                fields: ['role']
            }
        ]
    };

    const User = sequelize.define('User', attributes, options);
    console.log('User model defined.');

    // Log user creation
    User.afterCreate((user) => {
        logger.info(`User created: ID ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });

    // Log user deletion
    User.afterDestroy((user) => {
        logger.info(`User deleted: ID ${user.id}, Username: ${user.username}, Email: ${user.email}`);
    });

    return User;
}
