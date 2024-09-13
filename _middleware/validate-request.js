const Joi = require('joi');

module.exports = validateRequest;

function validateRequest(req, res, next, schema, type = 'body') {
    const options = {
        abortEarly: false,  // Collect all errors
        allowUnknown: true,  // Allow properties not defined in the schema
        stripUnknown: true  // Remove properties not defined in the schema
    };

    let data;
    switch (type) {
        case 'body':
            data = req.body;
            break;
        case 'query':
            data = req.query;
            break;
        case 'params':
            data = req.params;
            break;
        // Optionally handle other types if needed
        default:
            return res.status(400).json({ error: 'Invalid validation type' });
    }

    // Validate the data against the schema
    const { error, value } = schema.validate(data, options);

    if (error) {
        // Create a structured error response
        const errorDetails = error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
            type: detail.type
        }));

        // Respond with a JSON error object
        return res.status(400).json({
            error: 'Validation error',
            details: errorDetails
        });
    } else {
        // Assign the validated value to the appropriate request property
        switch (type) {
            case 'body':
                req.body = value;
                break;
            case 'query':
                req.query = value;
                break;
            case 'params':
                req.params = value;
                break;
        }
        next();
    }
}