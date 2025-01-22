const express = require('express');
const Cart = require('../entities/cart');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/', (req, res) => {
  const cart = new Cart(uuidv4());
  req.db.carts.push(cart);
  res.status(201).json(cart);
});

router.put('/:id/add', (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;
  const cart = req.db.carts.find((cart) => cart.id === id);
  const product = req.db.products.find((prod) => prod.id === productId);

  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cartItem = { productId, name: product.name, price: product.price, quantity };
  cart.products.push(cartItem);
  cart.calculateTotal();
  res.json(cart);
});

router.put('/:id/update', (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;
  const cart = req.db.carts.find((cart) => cart.id === id);

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const cartItem = cart.products.find((item) => item.productId === productId);
  if (!cartItem) return res.status(404).json({ message: 'Product not in cart' });

  cartItem.quantity = quantity;
  cart.calculateTotal();
  res.json(cart);
});

router.delete('/:id/remove', (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;
  const cart = req.db.carts.find((cart) => cart.id === id);

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.products = cart.products.filter((item) => item.productId !== productId);
  cart.calculateTotal();
  res.json(cart);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const cart = req.db.carts.find((cart) => cart.id === id);
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  res.json(cart);
});

  router.put('/:id/update-multiple', (req, res) => {
    const { id } = req.params;
    const { products } = req.body;
  
    const cart = req.db.carts.find((cart) => cart.id === id);
  
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });
  
    products.forEach(({ productId, quantity }) => {
      const cartItem = cart.products.find((item) => item.productId === productId);
      
      if (cartItem) {
        cartItem.quantity = quantity;
      } else {
        const product = req.db.products.find((prod) => prod.id === productId);
        if (product) {
          const newItem = { productId, name: product.name, price: product.price, quantity };
          cart.products.push(newItem);
        }
      }
    });
  
    cart.calculateTotal();
  
    res.json(cart);
  });

module.exports = router;
