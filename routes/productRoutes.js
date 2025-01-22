const express = require('express');
const Product = require('../entities/product');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create a new product
router.post('/', (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = new Product(uuidv4(), name, price, stock);
    req.db.products.push(product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing product
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  try {
    const product = req.db.products.find((prod) => prod.id === id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a product
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const index = req.db.products.findIndex((prod) => prod.id === id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    req.db.products.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a list of products
router.get('/', (req, res) => {
  try {
    const products = req.db.products;
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
