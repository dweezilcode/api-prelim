module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.error(err); // Log the error details for debugging

    if (typeof err === 'string') {
        // Handle string-based errors
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    } else if (err.name === 'ValidationError') {
        // Handle Joi validation errors specifically
        return res.status(400).json({
            message: 'Validation error',
            details: err.details
        });
    } else if (err.name === 'NotFoundError') {
        // Handle custom not found errors
        return res.status(404).json({
            message: err.message || 'Resource not found'
        });
    } else if (err.name === 'UnauthorizedError') {
        // Handle unauthorized access errors
        return res.status(401).json({
            message: err.message || 'Unauthorized access'
        });
    } else {
        // Handle unexpected errors
        return res.status(500).json({
            message: err.message || 'Internal Server Error',
            // Optionally include a stack trace for development (be cautious in production)
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
}