const express = require('express');
const Product = require('../entities/product');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


router.post('/', (req, res) => {
  const { name, price, stock } = req.body;
  const product = new Product(uuidv4(), name, price, stock);
  req.db.products.push(product);
  res.status(201).json(product);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  const product = req.db.products.find((prod) => prod.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.name = name || product.name;
  product.price = price || product.price;
  product.stock = stock || product.stock;
  res.json(product);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = req.db.products.findIndex((prod) => prod.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  req.db.products.splice(index, 1);
  res.status(204).send();
});

router.get('/', (req, res) => {
  const products = req.db.products;
  res.json(products);
});

module.exports = router;
