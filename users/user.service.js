const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const User = require('./user.model');

// Authenticate user and generate JWT
async function authenticate({ username, password }) {
    const user = await User.findOne({ where: { username } });

    if (!user) {
        throw 'Username or password is incorrect';
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
        throw 'Username or password is incorrect';
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, { expiresIn: '7d' });
    return { token, user };
}

// Register a new user
async function register({ username, password, role }) {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        throw 'Username already exists';
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    await User.create({ username, passwordHash, role });
}

module.exports = { authenticate, register };