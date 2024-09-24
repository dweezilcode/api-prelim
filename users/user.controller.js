// user.controller.js
const userService = require('./user.service');

async function register(req, res) {
    try {
        await userService.register(req.body);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body; // Extract username and password from the request body
        const user = await userService.authenticate({ username, password }); // Call the authenticate function
        res.json(user); // Return the user data along with the token
    } catch (error) {
        res.status(400).json({ message: error });
    }
}

module.exports = { register, login }; // Export both register and login functions