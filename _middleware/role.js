module.exports = function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles]; // Ensure roles is an array
    }

    return (req, res, next) => {
        console.log('Roles to check:', roles);  // Log allowed roles
        console.log('User from request:', req.user);  // Log the user object
        
        // Check if the user exists and if their role matches the allowed roles
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // If user role is allowed, proceed
        next();
    };
};
