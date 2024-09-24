const productService = require('./product.service');

// Get all products
async function getAll(req, res) {
    const products = await productService.getAll();
    res.json(products);
}

// Get product by ID
async function getById(req, res) {
    const product = await productService.getById(req.params.id);
    res.json(product);
}

// Create new product (Administrator/Manager)
async function create(req, res) {
    await productService.create(req.body);
    res.status(201).json({ message: 'Product created' });
}

// Update existing product (Administrator/Manager)
async function update(req, res) {
    await productService.update(req.params.id, req.body);
    res.json({ message: 'Product updated' });
}

// Delete product (Administrator/Manager)
async function remove(req, res) {
    await productService.delete(req.params.id);
    res.json({ message: 'Product deleted' });
}

module.exports = { getAll, getById, create, update, remove };