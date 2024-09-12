const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./user.service');

// Define routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.get('/search', search); // Endpoint for search
router.put('/:id/role', updateRoleSchema, updateRole);
router.post('/:id/permissions', modifyPermissionsSchema, grantPermissions);
router.delete('/:id/permissions', modifyPermissionsSchema, revokePermissions);

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
    const { email, name } = req.query;

    // Build search criteria
    const searchCriteria = {};
    if (email) searchCriteria.email = email;
    if (name) searchCriteria.firstName = name;

    userService.search(searchCriteria)
        .then(users => res.json(users))
        .catch(next);
}

function updateRole(req, res, next) {
    userService.updateRole(req.params.id, req.body.role)
        .then(() => res.json({ message: 'User role updated' }))
        .catch(next);
}

function grantPermissions(req, res, next) {
    userService.grantPermissions(req.params.id, req.body.permissions)
        .then(() => res.json({ message: 'Permissions granted' }))
        .catch(next);
}

function revokePermissions(req, res, next) {
    userService.revokePermissions(req.params.id, req.body.permissions)
        .then(() => res.json({ message: 'Permissions revoked' }))
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
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
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

function updateRoleSchema(req, res, next) {
    const schema = Joi.object({
        role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}

function modifyPermissionsSchema(req, res, next) {
    const schema = Joi.object({
        permissions: Joi.array().items(Joi.string()).required()
    });
    validateRequest(req, next, schema);
}