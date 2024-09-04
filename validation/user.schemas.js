const Joi = require('joi');
const Role = require('_helpers/role');

const searchSchema = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid(Role.Admin, Role.User).optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    dateCreated: Joi.date().optional(),
    dateLastLoggedIn: Joi.date().optional()
});

module.exports = {
    searchSchema
};
