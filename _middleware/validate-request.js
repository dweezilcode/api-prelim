module.exports = validateRequest;
<<<<<<< HEAD
function validateRequest(req, next, schema) {
=======

function validateRequest(req, res, next, schema) {
    console.log('Incoming request body:', req.body); // Log the request body

>>>>>>> 67bb0ddd1959aa525b3bb683796e01ece9c7f457
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };
<<<<<<< HEAD
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
=======

    const { error, value } = schema.validate(req.body, options);
    
    console.log('Validation result:', { error, value }); // Log validation result

    if (error) {
        const errorMessage = error.details.map(x => x.message).join(', ');
        // Pass a custom error object to next
        return next({ status: 400, message: `Validation error: ${errorMessage}` });
>>>>>>> 67bb0ddd1959aa525b3bb683796e01ece9c7f457
    } else {
        req.body = value;
        next();
    }
}
