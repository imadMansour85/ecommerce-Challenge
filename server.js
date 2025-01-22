const express = require('express');
const bodyParser = require('body-parser');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(bodyParser.json());

const db = {
  categories: [],
  products: [],
  carts: [],
};

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
