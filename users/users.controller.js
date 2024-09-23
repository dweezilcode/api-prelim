const express = require('express');
const Joi = require('joi');
const { validateRequest } = require('../_middleware/validate-request'); // Ensure path is correct
const Role = require('../_helpers/role'); // Ensure path is correct
const userService = require('./user.service'); // Ensure path is correct
const activityService = require('../users/activity.service'); // For logging activities
const logger = require('../_middleware/logger');
const jwt = require('jsonwebtoken'); // Add this line if it's missing

// Create a new Express router
const router = express.Router();

// Route handlers
function getAll(req, res, next) {
    userService.getAll()
        .then(users => {
            logger.info('Retrieved all users');
            res.json(users);
        })
        .catch(error => {
            logger.error('Error retrieving users:', error.message);
            next(error);
        });
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => {
            logger.info(`Retrieved user with ID: ${req.params.id}`);
            res.json(user);
        })
        .catch(error => {
            logger.error(`Error retrieving user with ID ${req.params.id}:`, error.message);
            next(error);
        });
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => {
            logger.info('User created:', req.body.email);
            res.json({ message: 'User created' });
        })
        .catch(error => {
            logger.error('Error creating user:', error.message);
            next(error);
        });
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => {
            logger.info(`User updated with ID: ${req.params.id}`);
            res.json({ message: 'User updated' });
        })
        .catch(error => {
            logger.error(`Error updating user with ID ${req.params.id}:`, error.message);
            next(error);
        });
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => {
            logger.info(`User deleted with ID: ${req.params.id}`);
            res.json({ message: 'User deleted' });
        })
        .catch(error => {
            logger.error(`Error deleting user with ID ${req.params.id}:`, error.message);
            next(error);
        });
}

function search(req, res, next) {
    userService.search(req.query)
        .then(result => {
            logger.info('User search executed');
            res.json({ total: result.count, users: result.rows });
        })
        .catch(error => {
            logger.error('Error during user search:', error.message);
            next(error);
        });
}

// Retrieve user preferences
async function getPreferences(req, res, next) {
    try {
        const preferences = await userService.getPreferences(req.params.userId);
        logger.info(`Retrieved preferences for user ID: ${req.params.userId}`);
        res.json(preferences);
    } catch (error) {
        logger.error(`Error retrieving preferences for user ID ${req.params.userId}:`, error.message);
        next(error);
    }
}

// Update user preferences
async function updatePreferences(req, res, next) {
    try {
        await userService.updatePreferences(req.params.userId, req.body);
        logger.info(`Updated preferences for user ID: ${req.params.userId}`);
        res.json({ message: 'Preferences updated' });
    } catch (error) {
        logger.error(`Error updating preferences for user ID ${req.params.userId}:`, error.message);
        next(error);
    }
}

// Log user activity
async function logActivity(req, res, next) {
    try {
        const activity = await activityService.logActivity({
            userId: req.params.userId,
            actionType: req.body.actionType,
            ipAddress: req.ip,
            browserInfo: req.headers['user-agent'],
        });
        res.status(201).json({ success: true, message: 'Activity logged successfully', activity });
    } catch (error) {
        logger.error('Error logging activity:', error.message);
        next(error);
    }
}

// Retrieve user activity
async function getActivity(req, res, next) {
    try {
        const activity = await activityService.getActivity(req.params.userId, req.query);
        res.json({ success: true, activity });
    } catch (error) {
        logger.error('Error retrieving activity:', error.message);
        next(error);
    }
}

async function authenticate(req, res, next) {
    try {
        const user = await userService.authenticate(req.body);
        // You can return a token or user details, as needed
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
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
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        username: Joi.string().allow(null),
        status: Joi.string().valid('Active', 'Inactive').allow(''),
        dateCreated: Joi.date().iso().allow(''),
        dateLastLoggedIn: Joi.date().iso().allow('')
    });
    validateRequest(req, res, next, schema); // Correct order of parameters
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
        username: Joi.string().allow(null)
    }).with('password', 'confirmPassword');
    validateRequest(req, res, next, schema); // Correct order of parameters
}

function searchSchema(req, res, next) {
    const schema = Joi.object({
        fullName: Joi.string().allow(''),
        email: Joi.string().email().allow(''),
        role: Joi.string().valid(Role.Admin, Role.User).allow(''),
        status: Joi.string().valid('Active', 'Inactive').allow(''),
        dateCreatedStart: Joi.date().iso().allow(''),
        dateCreatedEnd: Joi.date().iso().allow(''),
        dateLastLoggedInStart: Joi.date().iso().allow(''),
        dateLastLoggedInEnd: Joi.date().iso().allow('')
    });
    validateRequest(req, res, next, schema); // Correct order of parameters
}

function updatePreferencesSchema(req, res, next) {
    const schema = Joi.object({
        themeColor: Joi.string().valid('light', 'dark', 'blue').optional(),
        emailNotifications: Joi.boolean().optional(),
        language: Joi.string().valid('en', 'es', 'fr').optional()
    });
    validateRequest(req, res, next, schema); // Correct order of parameters
}

function logActivitySchema(req, res, next) {
    const schema = Joi.object({
        actionType: Joi.string().valid('login', 'logout', 'profile update', 'password change').required()
    });
    validateRequest(req, res, next, schema);
}

// Define routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

router.get('/search', searchSchema, search);

router.get('/:userId/preferences', getPreferences);
router.put('/:userId/preferences', updatePreferencesSchema, updatePreferences);

// New activity logging routes
router.post('/:userId/activity', logActivitySchema, logActivity);
router.get('/:userId/activity', getActivity);

// Add to your routes
router.post('/login', authenticate);

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    search,
    getPreferences,
    updatePreferences,
    logActivity,
    getActivity,
};

module.exports = router;
