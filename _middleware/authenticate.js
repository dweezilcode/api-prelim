const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // Your JWT secret from environment variables

module.exports = function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Assuming the format: 'Bearer TOKEN'
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: Malformed token.' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.user = user; // Attach user info to request object
        next(); // Pass control to the next middleware or route handler
    });
};
