const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,  // Ensures that each email is unique
            validate: {
                isEmail: true  // Validates that the field contains a valid email
            }
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Admin', 'User']]  // Validates that the role is either 'Admin' or 'User'
            }
        },
        permissions: {
            type: DataTypes.JSON,  // Use JSON data type for MySQL
            allowNull: true  // Permissions are optional and can be empty
        }
    }, {
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }  // Excludes passwordHash by default
        },
        scopes: {
            withHash: { attributes: {} }  // Includes all attributes, including passwordHash
        },
        timestamps: true,  // Adds createdAt and updatedAt fields
        indexes: [
            {
                unique: true,
                fields: ['email']  // Index on email field for uniqueness
            }
        ]
    });

    return User;
};