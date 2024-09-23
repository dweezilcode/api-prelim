const { DataTypes } = require('sequelize');
const logger = require('../_middleware/logger');

module.exports = (sequelize) => {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        actionType: { type: DataTypes.STRING, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        ipAddress: { type: DataTypes.STRING, allowNull: false },
        browserInfo: { type: DataTypes.STRING, allowNull: false }
    };

    const Activity = sequelize.define('Activity', attributes);

    // Log creation of activity records
    Activity.afterCreate((activity) => {
        logger.info(`Activity logged: User ID ${activity.userId}, Action: ${activity.actionType}, Timestamp: ${activity.timestamp}`);
    });

    // Log deletion of activity records
    Activity.afterDestroy((activity) => {
        logger.info(`Activity deleted: User ID ${activity.userId}, Action: ${activity.actionType}, Timestamp: ${activity.timestamp}`);
    });

    return Activity;
};
