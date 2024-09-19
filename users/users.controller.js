const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRequest = require('_middleware/validate-request'); // Ensure this path is correct
const Role = require('_helpers/role');
const { User } = require('users/user.model'); // Import the User model from your models directory

const router = express.Router();

// Retrieve user preferences
async function getPreferences(req, res, next) {
    try {
        const preferences = await userService.getPreferences(req.params.userId); 
        res.json(preferences);
    } catch (error) {
        next(error); 
    }
}

// Update user preferences
async function updatePreferences(req, res, next) {
    try {
        await userService.updatePreferences(req.params.userId, req.body); 
        res.json({ message: 'Preferences updated' });
    } catch (error) {
        next(error); 
    }
}

// Validation schema for updating preferences
function updatePreferencesSchema(req, res, next) {
    const schema = Joi.object({
        themeColor: Joi.string().valid('light', 'dark', 'blue').optional(),
        emailNotifications: Joi.boolean().optional(),
        language: Joi.string().valid('en', 'es', 'fr').optional()
    });
    validateRequest(req, next, schema);
}

// Route handlers
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

function search(req, res, next) {
    userService.search(req.query)
        .then(result => res.json({ total: result.count, users: result.rows }))
        .catch(next);
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
        status: Joi.string().valid('Active', 'Inactive').allow(''),
        dateCreated: Joi.date().iso().allow(''),
        dateLastLoggedIn: Joi.date().iso().allow('')
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
    validateRequest(req, next, schema);
}

// POST /login route for authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token valid for 7 days
        );

        // Respond with the token
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Define routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

router.get('/search', searchSchema, search);
router.get('/:userId/preferences', getPreferences);
router.put('/:userId/preferences', updatePreferencesSchema, updatePreferences);

module.exports = router;