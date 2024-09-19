const express = require('express');
const router = express.Router();
const Joi = require('joi');
const productService = require('./product.service');
const { validateRequest, authenticate, validateRole } = require('../_middleware/validate-request');

// Use authentication middleware for all routes
router.use(authenticate);

// Routes
router.post('/', validateRole(['Admin', 'Manager']), createProductSchema, createProduct);
router.put('/:productId', validateRole(['Admin', 'Manager']), updateProductSchema, updateProduct);

module.exports = router;

// Controller functions

// Create a new product
async function createProduct(req, res, next) {
    try {
        const product = await productService.create(req.body);
        return res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            product
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Update an existing product
async function updateProduct(req, res, next) {
    try {
        const product = await productService.update(req.params.productId, req.body);
        return res.json({
            success: true,
            message: 'Product updated successfully!',
            product
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Joi schema validation for creating a product
function createProductSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(), // Name should be a string and is required
        description: Joi.string().allow('').optional(), // Description can be an empty string or optional
        price: Joi.number().precision(2).required(), // Price should be a number with 2 decimal points
        status: Joi.string().valid('active', 'deleted').optional() // Status should be either 'active' or 'deleted'
    });
    validateRequest(req, next, schema);
}

// Joi schema validation for updating a product
function updateProductSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().allow('').optional(), // Name can be an empty string or optional
        description: Joi.string().allow('').optional(), // Description can be an empty string or optional
        price: Joi.number().precision(2).optional(), // Price can be optional
        status: Joi.string().valid('active', 'deleted').optional() // Status should be either 'active' or 'deleted'
    });
    validateRequest(req, next, schema);
}