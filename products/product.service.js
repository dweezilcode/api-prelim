const Product = require('./product.model');

// Get all products
async function getAll() {
    return await Product.findAll();
}

// Get product by ID
async function getById(id) {
    return await Product.findByPk(id);
}

// Create new product
async function create(productData) {
    await Product.create(productData);
}

// Update existing product
async function update(id, productData) {
    const product = await getById(id);
    if (!product) throw 'Product not found';
    Object.assign(product, productData);
    await product.save();
}

// Delete product
async function deleteProduct(id) {
    const product = await getById(id);
    if (!product) throw 'Product not found';
    await product.destroy();
}

module.exports = { getAll, getById, create, update, delete: deleteProduct };