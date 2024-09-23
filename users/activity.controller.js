const express = require('express');
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request'); // Ensure path is correct
const activityService = require('./activity.service');
const logger = require('../_middleware/logger');

const router = express.Router();

// Log user activity
async function logActivity(req, res, next) {
    try {
        await activityService.logActivity(req.params.userId, req.body.actionType, req.body.ipAddress, req.body.browserInfo);
        logger.info(`Activity logged for user ID: ${req.params.userId}, Action: ${req.body.actionType}`);
        res.status(201).json({ message: 'Activity logged' });
    } catch (error) {
        logger.error(`Error logging activity for user ID ${req.params.userId}:`, error.message);
        next(error);
    }
}

// Retrieve user activity
async function getActivities(req, res, next) {
    try {
        const filters = req.query;
        const activities = await activityService.getActivities(req.params.userId, filters);
        logger.info(`Retrieved activities for user ID: ${req.params.userId}`);
        res.json(activities);
    } catch (error) {
        logger.error(`Error retrieving activities for user ID ${req.params.userId}:`, error.message);
        next(error);
    }
}

// Validation schema for logging activity
function logActivitySchema(req, res, next) {
    const schema = Joi.object({
        actionType: Joi.string().valid('login', 'logout', 'profile update', 'password change').required(),
        ipAddress: Joi.string().required(),
        browserInfo: Joi.string().required(),
    });
    validateRequest(req, res, next, schema);
}

// Define routes
router.post('/:userId/activity', logActivitySchema, logActivity);
router.get('/:userId/activity', getActivities);

module.exports = router;
