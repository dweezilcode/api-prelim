const Joi = require('joi');
const validateRequest = require('_middleware/validate-request'); // Ensure this path is correct
const Role = require('_helpers/role');
const userService = require('../services/user.service'); // Ensure this path is correct

// Retrieve user preferences
async function getPreferences(req, res, next) {
    try {
        const preferences = await userService.getPreferences(req.params.userId); // Correct parameter
        res.json(preferences);
    } catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
}

// Update user preferences
async function updatePreferences(req, res, next) {
    try {
        await userService.updatePreferences(req.params.userId, req.body); // Correct parameter
        res.json({ message: 'Preferences updated' });
    } catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
}

// Validation schema for updating preferences
function updatePreferencesSchema(req, res, next) {
    const schema = Joi.object({
        themeColor: Joi.string().valid('light', 'dark', 'blue').optional(), // Added 'blue'
        emailNotifications: Joi.boolean().optional(),
        language: Joi.string().valid('en', 'es', 'fr').optional()
    });
    validateRequest(req, next, schema);
}

// Routes for user CRUD operations
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'User created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

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
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    _delete,
    createSchema,
    updateSchema,
    getPreferences,
    updatePreferences,
    updatePreferencesSchema
};
