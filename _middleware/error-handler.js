module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof err === 'string') {
        // Handle string errors, like 'Not Found'
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    }

    // Handle object errors (usually instances of Error)
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
}