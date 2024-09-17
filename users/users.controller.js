const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./user.service');

// Routes
router.get('/search', searchSchema, search);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// Route handlers
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'User created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

function search(req, res, next) {
    userService.search(req.query)
        .then(result => res.json({ total: result.count, users: result.rows }))
        .catch(next);
}

// Validation schemas
function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        status: Joi.string().valid('Active', 'Inactive').allow(''),
        dateCreated: Joi.date().iso().allow(''),
        dateLastLoggedIn: Joi.date().iso().allow('')
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function searchSchema(req, res, next) {
    const schema = Joi.object({
        fullName: Joi.string().allow(''),
        email: Joi.string().email().allow(''),
        role: Joi.string().valid(Role.Admin, Role.User).allow(''),
        status: Joi.string().valid('Active', 'Inactive').allow(''),
        dateCreatedStart: Joi.date().iso().allow(''),
        dateCreatedEnd: Joi.date().iso().allow(''),
        dateLastLoggedInStart: Joi.date().iso().allow(''),
        dateLastLoggedInEnd: Joi.date().iso().allow('')
    });
    validateRequest(req, next, schema);
}
