const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const activityService = require('./activity.service');

// Define routes
router.post('/:userId/activity', logActivitySchema, logActivity);
router.get('/:userId/activity', getActivitiesSchema, getActivities);

module.exports = router;

function logActivity(req, res, next) {
    const { userId } = req.params;
    const { actionType, ipAddress, browserInfo } = req.body;

    activityService.logActivity(userId, actionType, ipAddress, browserInfo)
        .then(() => res.json({ message: 'Activity logged' }))
        .catch(next);
}

function getActivities(req, res, next) {
    const { userId } = req.params;
    const filters = req.query;

    activityService.getActivities(userId, filters)
        .then(activities => res.json(activities))
        .catch(next);
}

function logActivitySchema(req, res, next) {
    const schema = Joi.object({
        actionType: Joi.string().required(),
        ipAddress: Joi.string().required(),
        browserInfo: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function getActivitiesSchema(req, res, next) {
    const schema = Joi.object({
        actionType: Joi.string().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional()
    });
    validateRequest(req, next, schema);
}
