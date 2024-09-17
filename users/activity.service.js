const { Op } = require('sequelize'); // Make sure Sequelize's Op is imported
const db = require('_helpers/db');

module.exports = {
    logActivity,
    getActivities
};

async function logActivity(userId, actionType, ipAddress, browserInfo) {
    await db.Activity.create({
        userId,
        actionType,
        ipAddress,
        browserInfo
    });
}

async function getActivities(userId, filters) {
    const where = { userId };  // Always filter by userId

    // Add optional filters
    if (filters.actionType) {
        where.actionType = filters.actionType;
    }

    if (filters.ipAddress) {
        where.ipAddress = filters.ipAddress;
    }

    if (filters.browserInfo) {
        where.browserInfo = filters.browserInfo;
    }

    if (filters.startDate && filters.endDate) {
        where.timestamp = {
            [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
        };
    }

    return await db.Activity.findAll({ where });
}
