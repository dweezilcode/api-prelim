module.exports = validateRequest;

function validateRequest(req, res, next, schema) {
    console.log('Incoming request body:', req.body); // Log the request body

    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

    const { error, value } = schema.validate(req.body, options);
    
    console.log('Validation result:', { error, value }); // Log validation result

    if (error) {
        const errorMessage = error.details.map(x => x.message).join(', ');
        // Pass a custom error object to next
        return next({ status: 400, message: `Validation error: ${errorMessage}` });
    } else {
        req.body = value;
        next();
    }
}
