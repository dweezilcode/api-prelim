class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserError';
        this.statusCode = 400; // Example status code for user errors
    }
}

module.exports = {
    UserError
};