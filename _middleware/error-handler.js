function errorHandler(err, req, res, next) {
    console.error(err); // Log the error for debugging

    if (err.isJoi) {
        // Handle Joi validation errors
        return res.status(400).json({ message: err.details.map(x => x.message).join(', ') });
    }

    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message || 'An unexpected error occurred.' });
    }
}

// Export the error handler function
module.exports = errorHandler;
