const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        fullName: { type: DataTypes.VIRTUAL, get() { return `${this.firstName} ${this.lastName}`; } },
        role: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false },
        dateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        dateLastLoggedIn: { type: DataTypes.DATE, allowNull: true }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}
