const { Op } = require('sequelize');
const db = require('../_helpers/db');
const logger = require('../_middleware/logger');

async function createProduct(productData) {
    const product = await db.Product.create(productData);
    logger.info(`Product created: ID ${product.id}, Name: ${product.name}`); // Log creation
    return product;
}

async function updateProduct(productId, updateData) {
    const product = await db.Product.findByPk(productId);
    if (!product) throw new Error('Product not found');
    const updatedProduct = await product.update(updateData);
    logger.info(`Product updated: ID ${product.id}, Name: ${product.name}`); // Log update
    return updatedProduct;
}

async function getProduct(productId) {
    const product = await db.Product.findByPk(productId);
    logger.info(`Product retrieved: ID ${productId}, Name: ${product?.name}`); // Log retrieval
    return product;
}

async function getProducts(filters) {
    const where = {};
    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
    if (filters.status) where.status = filters.status;
    if (filters.priceMin && filters.priceMax) {
        where.price = {
            [Op.between]: [parseFloat(filters.priceMin), parseFloat(filters.priceMax)]
        };
    }
    const products = await db.Product.findAll({ where });
    logger.info(`Products retrieved: ${products.length} found`); // Log retrieval
    return products;
}

module.exports = { createProduct, updateProduct, getProduct, getProducts };
