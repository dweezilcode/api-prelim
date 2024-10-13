const userService = require('./user.service'); // Adjusted to use the singleton instance directly
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');

const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('administrator', 'user', 'customer').required()
});

async function register(req, res) {
    try {
        validateRequest(req, res, async () => {
            try {
                await userService.register(req.body);
                res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
                console.log('Service error during registration:', error);
                res.status(400).json({ message: error.message || error });
            }
        }, registerSchema);
    } catch (error) {
        console.log('Unexpected error:', error);
        res.status(400).json({ message: error.message || error });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await userService.authenticate({ username, password });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message || error });
    }
}

module.exports = { register, login };
