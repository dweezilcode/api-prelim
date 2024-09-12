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
                isIn: [['Admin', 'User']]  // Ensures role is either 'Admin' or 'User'
            }
        }
    }, {
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }  // Exclude passwordHash by default
        },
        scopes: {
            withHash: { attributes: {} }  // Include all attributes, including passwordHash
        },
        timestamps: true,  // Adds createdAt and updatedAt fields
        indexes: [
            {
                unique: true,
                fields: ['email']  // Index on email field
            }
        ]
    });

    return User;
};