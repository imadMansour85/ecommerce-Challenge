const express = require('express');
const Category = require('../entities/category');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create a new category
router.post('/', (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category(uuidv4(), name, description);
    req.db.categories.push(category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = req.db.categories.find((cat) => cat.id === id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;
    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a category
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const index = req.db.categories.findIndex((cat) => cat.id === id);
    if (index === -1) return res.status(404).json({ message: 'Category not found' });

    req.db.categories.splice(index, 1);
    res.status(204).send("Category deleted");
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get list of categories
router.get('/list', (req, res) => {
  try {
    const categories = req.db.categories;

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    const sanitizedCategories = categories.map(category => {
      const sanitizedCategory = { ...category };

      if (sanitizedCategory.products) {
        sanitizedCategory.products = sanitizedCategory.products.map(product => {
          const sanitizedProduct = { ...product };
          sanitizedProduct.categories = undefined;
          return sanitizedProduct;
        });
      }

      return sanitizedCategory;
    });

    res.json(sanitizedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Link a product to a category
router.put('/:categoryId/products/:productId/link', (req, res) => {
  const { categoryId, productId } = req.params;

  try {
    const category = req.db.categories.find(cat => cat.id === categoryId);
    const product = req.db.products.find(prod => prod.id === productId);

    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    category.addProduct(product);
    product.addCategory(category);

    const sanitizedCategory = { ...category };
    sanitizedCategory.products = undefined;

    const sanitizedProduct = { ...product };
    sanitizedProduct.categories = undefined;

    res.json({
      message: 'Product linked to category',
      category: sanitizedCategory,
      product: sanitizedProduct
    });
  } catch (error) {
    console.error('Error linking product to category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unlink a product from a category
router.put('/:categoryId/products/:productId/unlink', (req, res) => {
  const { categoryId, productId } = req.params;

  try {
    const category = req.db.categories.find(cat => cat.id === categoryId);
    const product = req.db.products.find(prod => prod.id === productId);

    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    category.products = category.products.filter(prod => prod.id !== productId);
    product.categories = product.categories.filter(cat => cat.id !== categoryId);

    res.json({ message: 'Product unlinked from category', category, product });
  } catch (error) {
    console.error('Error unlinking product from category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
