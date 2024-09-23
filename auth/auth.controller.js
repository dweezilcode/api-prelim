const db = require('../_helpers/db'); // Adjust the path as necessary
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const logger = require('../_middleware/logger');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log the incoming request
        console.log('Login request:', { email, password });

        // Ensure that email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await db.User.findOne({ where: { email } });

        // Log the user found (or not)
        console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if passwordHash is defined
        if (!user.passwordHash) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        logger.error('Login error:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const logout = (req, res) => {
    // Implement logout logic here if needed, e.g., token invalidation
    return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    login,
    logout,
};
