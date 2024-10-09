const jwt = require('jsonwebtoken');
const config = require('../config.json'); // Load secret from config file

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }

        // Set the user information to request, this includes user ID and role
        req.user = { id: decoded.sub, role: decoded.role };

        next();
    });
};
