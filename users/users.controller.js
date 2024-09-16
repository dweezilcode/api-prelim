const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const { Op } = require('sequelize'); // Import Op for search queries
const userService = require('./user.service');

// Define routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', deleteUser);
router.get('/search', search);
router.put('/:id/role', updateRoleSchema, updateRole);
router.post('/:id/permissions', modifyPermissionsSchema, grantPermissions);
router.delete('/:id/permissions', modifyPermissionsSchema, revokePermissions);
router.post('/:userId/activity', logActivitySchema, logActivity);
router.get('/:userId/activity', retrieveActivitySchema, retrieveActivities);

module.exports = router;

// Route handlers using async/await

async function getAll(req, res, next) {
    try {
        const users = await userService.getAll();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error in getAll controller:', error); // Log the detailed error
        next(error); // Pass the error to the error handler
    }
}

async function getById(req, res, next) {
    try {
        const user = await userService.getById(req.params.id);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
}

async function create(req, res, next) {
    try {
        await userService.create(req.body);
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        await userService.update(req.params.id, req.body);
        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}

async function search(req, res, next) {
    try {
        // Validate the query parameters
        const { error, value } = searchSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details
            });
        }

        const { email, name, page, limit } = value;

        // Build search criteria
        const searchCriteria = {};
        if (email) searchCriteria.email = { [Op.like]: `%${email}%` };
        if (name) searchCriteria.firstName = { [Op.like]: `%${name}%` };

        // Call the userService to fetch users with pagination
        const users = await userService.search(searchCriteria, { page, limit });

        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

async function updateRole(req, res, next) {
    try {
        await userService.updateRole(req.params.id, req.body.role);
        res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function grantPermissions(req, res, next) {
    try {
        await userService.grantPermissions(req.params.id, req.body.permissions);
        res.json({ success: true, message: 'Permissions granted successfully' });
    } catch (error) {
        next(error);
    }
}

async function revokePermissions(req, res, next) {
    try {
        await userService.revokePermissions(req.params.id, req.body.permissions);
        res.json({ success: true, message: 'Permissions revoked successfully' });
    } catch (error) {
        next(error);
    }
}

// Validation schemas
function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, res, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().allow(''),
        firstName: Joi.string().allow(''),
        lastName: Joi.string().allow(''),
        role: Joi.string().valid(Role.Admin, Role.User).allow(''),
        email: Joi.string().email().allow(''),
        password: Joi.string().min(6).allow(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).allow('')
    }).with('password', 'confirmPassword');
    validateRequest(req, res, next, schema);
}

function updateRoleSchema(req, res, next) {
    const schema = Joi.object({
        role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, res, next, schema);
}

function modifyPermissionsSchema(req, res, next) {
    const schema = Joi.object({
        permissions: Joi.array().items(Joi.string()).required()
    });
    validateRequest(req, res, next, schema);
}
async function logActivity(req, res, next) {
    try {
        const { userId } = req.params;
        const { actionType, ipAddress, browserInfo } = req.body;

        // Call the service to log activity
        await userService.logUserActivity(userId, actionType, ipAddress, browserInfo);
        res.json({ success: true, message: 'Activity logged successfully' });
    } catch (error) {
        next(error);
    }
}

async function retrieveActivities(req, res, next) {
    try {
        const { userId } = req.params;
        const filter = {};

        const { actionType, startTimestamp, endTimestamp } = req.query;
        if (actionType) filter.actionType = actionType;
        if (startTimestamp || endTimestamp) {
            filter.timestamp = {};
            if (startTimestamp) filter.timestamp[Op.gte] = new Date(startTimestamp);
            if (endTimestamp) filter.timestamp[Op.lte] = new Date(endTimestamp);
        }

        // Call the service to get activities
        const activities = await userService.getUserActivities(userId, filter);
        res.json({ success: true, data: activities });
    } catch (error) {
        next(error);
    }
}

// Validation schemas
function logActivitySchema(req, res, next) {
    const schema = Joi.object({
        actionType: Joi.string().valid('login', 'logout', 'profile update', 'password change').required(),
        ipAddress: Joi.string().ip().required(),
        browserInfo: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

function retrieveActivitySchema(req, res, next) {
    const schema = Joi.object({
        actionType: Joi.string().valid('login', 'logout', 'profile update', 'password change'),
        startTimestamp: Joi.date(),
        endTimestamp: Joi.date()
    });
    validateRequest(req, res, next, schema, 'query');
}

module.exports = router;