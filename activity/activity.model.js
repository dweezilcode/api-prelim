const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        actionType: { type: DataTypes.STRING, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        ipAddress: { type: DataTypes.STRING, allowNull: false },
        browserInfo: { type: DataTypes.STRING, allowNull: false }
    };

    return sequelize.define('Activity', attributes);
};
