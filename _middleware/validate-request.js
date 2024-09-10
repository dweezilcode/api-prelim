module.exports = validateRequest;

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }

}

function validateRequest(req, next, schema) {
    const { error } = schema.validate(req.body);
    if (error) {
        return next(new Error(error.details[0].message));
    }
    next();
}

module.exports = validateRequest;
