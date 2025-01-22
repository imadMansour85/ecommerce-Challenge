const express = require('express');
const Cart = require('../entities/cart');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create a cart
router.post('/', (req, res) => {
  try {
    const cart = new Cart(uuidv4());
    req.db.carts.push(cart);
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add product to cart
router.put('/:id/add', (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = req.db.carts.find((cart) => cart.id === id);
    const product = req.db.products.find((prod) => prod.id === productId);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cartItem = { productId, name: product.name, price: product.price, quantity };
    cart.products.push(cartItem);
    cart.calculateTotal();

    res.json(cart);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product in cart
router.put('/:id/update', (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = req.db.carts.find((cart) => cart.id === id);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItem = cart.products.find((item) => item.productId === productId);
    if (!cartItem) return res.status(404).json({ message: 'Product not in cart' });

    cartItem.quantity = quantity;
    cart.calculateTotal();
    res.json(cart);
  } catch (error) {
    console.error('Error updating product in cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product from cart
router.delete('/:id/remove', (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  try {
    const cart = req.db.carts.find((cart) => cart.id === id);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter((item) => item.productId !== productId);
    cart.calculateTotal();
    res.json(cart);
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart details
router.get('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const cart = req.db.carts.find((cart) => cart.id === id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update multiple products in the cart
router.put('/:id/update-multiple', (req, res) => {
  const { id } = req.params;
  const { products } = req.body;

  try {
    const cart = req.db.carts.find((cart) => cart.id === id);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    products.forEach(({ productId, quantity }) => {
      const cartItem = cart.products.find((item) => item.productId === productId);

      if (cartItem) {
        cartItem.quantity = quantity;
      } else {
        const product = req.db.products.find((prod) => prod.id === productId);
        if (product) {
          const newItem = { productId, name: product.name, price: product.price, quantity };
          cart.products.push(newItem);
        } else {
          console.error(`Product with id ${productId} not found`);
        }
      }
    });

    cart.calculateTotal();
    res.json(cart);
  } catch (error) {
    console.error('Error updating multiple products in cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
