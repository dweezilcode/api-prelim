const Joi = require('joi');

// Middleware to validate request against a Joi schema
function validateRequest(schema) {
    return (req, res, next) => {
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        const { error, value } = schema.validate(req.body, options);
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Validation error: ${error.details.map(x => x.message).join(', ')}`
            });
        }
        req.body = value;
        next();
    };
}

// Middleware to validate user roles
function validateRole(roles) {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ success: false, message: 'Access denied. Unauthorized role.' });
        }
        next();
    };
}

// Middleware to authenticate user
function authenticate(req, res, next) {
    // Implement your authentication logic here
    // For example, check if the user is logged in and set req.user
    // If authenticated, call next(); otherwise, respond with an error
    if (!req.user) { // Assuming req.user is set by your authentication logic
        return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    next();
}

module.exports = {
    validateRequest,
    validateRole,
    authenticate // Make sure to export the authenticate function
};
