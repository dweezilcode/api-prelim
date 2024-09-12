module.exports = validateRequest;

function validateRequest(req, res, next, schema) {
    const options = {
        abortEarly: false,  // Collect all errors
        allowUnknown: true,  // Allow properties not defined in the schema
        stripUnknown: true  // Remove properties not defined in the schema
    };
    
    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body, options);
    
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
        // Assign the validated value to req.body
        req.body = value;
        next();
    }}