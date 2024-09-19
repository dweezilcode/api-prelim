const jwt = require('jsonwebtoken');

module.exports = {
    validateRequest,
    authenticate,
    validateRole
};

// Function to validate request body against schema (using Joi)
function validateRequest(req, res, next, schema) {
    const options = {
        abortEarly: false, // Include all validation errors
        allowUnknown: true, // Allow unknown fields
        stripUnknown: true  // Remove unknown fields from the object
    };
    
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        return res.status(400).json({
            success: false,
            message: `Validation error: ${error.details.map(x => x.message).join(', ')}`
        });
    }
    
    req.body = value; // Set the validated value to req.body
    next(); // Proceed to the next middleware
}

// Middleware to authenticate user via JWT
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Add this log for debugging

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. Invalid token.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Access denied. Invalid token.' });
        }

        req.user = decoded;
        next();
    });
}

// Middleware to validate user roles
function validateRole(roles) {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(403).json({ success: false, message: 'Access denied. No role found for user.' });
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({ success: false, message: `Access denied. Unauthorized role: ${userRole}` });
        }

        next(); // Proceed to the next middleware
    };
}