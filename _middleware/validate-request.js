module.exports = validateRequest;

function validateRequest(req, next, schema, location = 'body') {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

    const data = location === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(data, options);

    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        if (location === 'query') {
            req.query = value;
        } else {
            req.body = value;
        }
        next();
    }
}
