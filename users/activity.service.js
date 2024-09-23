const { Op } = require('sequelize');
const db = require('../_helpers/db');
const logger = require('../_middleware/logger');

module.exports = {
    logActivity,
    getActivities
};

// Log user activity
async function logActivity(userId, actionType, ipAddress, browserInfo) {
    try {
        await db.Activity.create({
            userId,
            actionType,
            ipAddress,
            browserInfo
        });
        logger.info(`Activity logged: User ID ${userId}, Action Type: ${actionType}`);
    } catch (error) {
        logger.error(`Error logging activity for User ID ${userId}: ${error.message}`);
        throw error; // Rethrow the error for further handling
    }
}

// Retrieve user activity with optional filters
async function getActivities(userId, filters) {
    const where = { userId };

    if (filters.actionType) {
        where.actionType = filters.actionType;
    }

    if (filters.startDate && filters.endDate) {
        where.timestamp = {
            [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
        };
    }

    try {
        const activities = await db.Activity.findAll({ where });
        logger.info(`Retrieved ${activities.length} activities for User ID ${userId}`);
        return activities;
    } catch (error) {
        logger.error(`Error retrieving activities for User ID ${userId}: ${error.message}`);
        throw error; // Rethrow the error for further handling
    }
}
