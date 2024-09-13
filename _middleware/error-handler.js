'use strict';

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    // Log the error details for debugging
    console.error(err);

    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    let errorDetails = null;

    if (typeof err === 'string') {
        // Handle string-based errors
        const is404 = err.toLowerCase().endsWith('not found');
        statusCode = is404 ? 404 : 400;
        errorMessage = err;
    } else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Handle malformed JSON syntax errors
        statusCode = 400;
        errorMessage = 'Malformed JSON';
        errorDetails = err.message;
    } else if (err.name === 'ValidationError') {
        // Handle Joi validation errors
        statusCode = 400;
        errorMessage = 'Validation error';
        errorDetails = err.details.map(detail => ({
            message: detail.message,
            path: detail.path,
            type: detail.type
        }));
    } else if (err.name === 'NotFoundError') {
        // Handle custom not found errors
        statusCode = 404;
        errorMessage = err.message || 'Resource not found';
    } else if (err.name === 'UnauthorizedError') {
        // Handle unauthorized access errors
        statusCode = 401;
        errorMessage = err.message || 'Unauthorized access';
    } else if (err instanceof Error) {
        // Handle other general errors
        errorMessage = err.message;
        errorDetails = err.stack;
    }

    // Send the response
    res.status(statusCode).json({
        error: errorMessage,
        details: errorDetails,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}