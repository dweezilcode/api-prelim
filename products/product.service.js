const { Op } = require('sequelize'); // Import Sequelize's Op if you need to use it for complex queries
const db = require('_helpers/db'); // Import your database instance

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    getProducts
};

// Create a new product
async function createProduct(productData) {
    try {
        return await db.Product.create(productData);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Update an existing product
async function updateProduct(productId, updateData) {
    try {
        const product = await db.Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return await product.update(updateData);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Retrieve a single product by ID
async function getProduct(productId) {
    try {
        return await db.Product.findByPk(productId);
    } catch (error) {
        console.error('Error retrieving product:', error);
        throw error;
    }
}

// Retrieve multiple products with optional filters
async function getProducts(filters) {
    try {
        const where = {};

        // Add optional filters
        if (filters.name) {
            where.name = { [Op.like]: `%${filters.name}%` };
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.priceMin && filters.priceMax) {
            where.price = {
                [Op.between]: [parseFloat(filters.priceMin), parseFloat(filters.priceMax)]
            };
        }

        return await db.Product.findAll({ where });
    } catch (error) {
        console.error('Error retrieving products:', error);
        throw error;
    }
}