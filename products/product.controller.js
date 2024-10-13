const express = require('express');
const router = express.Router();
const { Product } = require('_helpers/db');
const authorize = require('_middleware/authorize');

// View all products (Admin/Manager/Customer)
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.findAll({ where: { status: 'active' } });
        res.json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// View product details by ID (Admin/Manager/Customer)
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Error retrieving product details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new product (Admin/Manager)
router.post('/', authorize(['Admin', 'Manager']), async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body; // Include stock in the request body
        const product = await Product.create({ name, description, price, stock }); // Ensure stock is saved
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update product details (Admin/Manager)
router.put('/:id', authorize(['Admin', 'Manager']), async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Check stock availability (Customer)
router.get('/:productId/availability', async (req, res, next) => {
    try {
        const productId = req.params.productId;

        // Find the product by ID
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock availability
        const stockAvailable = product.stock > 0; // Assuming you have a stock field in the Product model

        res.json({
            productId: product.id,
            name: product.name,
            isAvailable: stockAvailable,
            stock: product.stock
        });
    } catch (error) {
        console.error('Error checking stock availability:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
