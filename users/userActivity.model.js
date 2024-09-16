const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserActivity = sequelize.define('UserActivity', {
        actionType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        browserInfo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        timestamps: false,  // Since we are manually setting the timestamp
        indexes: [
            {
                fields: ['userId']
            }
        ]
    });

    return UserActivity;
};