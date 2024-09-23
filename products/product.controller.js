const express = require('express');
const router = express.Router();
const Joi = require('joi');
const productService = require('./product.service');
const { validateRequest, validateRole } = require('../_middleware/validate-request');
const logger = require('../_middleware/logger');

// Middleware to validate roles for creating and updating products
router.post('/', validateRole(['Admin', 'Manager']), createProductSchema, createProduct);
router.put('/:productId', validateRole(['Admin', 'Manager']), updateProductSchema, updateProduct);

module.exports = router;

async function createProduct(req, res, next) {
    try {
        const product = await productService.createProduct(req.body);
        logger.info('Product created successfully:', product.name);
        res.status(201).json({ success: true, message: 'Product created successfully!', product });
    } catch (error) {
        logger.error('Error creating product:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

async function updateProduct(req, res, next) {
    try {
        const product = await productService.updateProduct(req.params.productId, req.body);
        logger.info(`Product updated successfully: ${req.params.productId}`);
        res.status(204).send(); // Alternatively, you can send a success message.
    } catch (error) {
        logger.error('Error updating product:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

function createProductSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        status: Joi.string().valid('Available', 'Deleted').default('Available')
    });
    validateRequest(req, res, next, schema);
}

function updateProductSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        description: Joi.string().empty(''),
        price: Joi.number().empty(''),
        status: Joi.string().valid('Available', 'Deleted').empty('')
    });
    validateRequest(req, res, next, schema);
}
