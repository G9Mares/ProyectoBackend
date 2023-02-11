const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const productManager = new ProductManager('./products.json');

app.get('/products', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = await productManager.getProducts();
  if (limit) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});

app.get('/products/:pid', async (req, res) => {
  const product = await productManager.getProduct(parseInt(req.params.pid));
  if (!product) {
    res.status(404).send({ error: 'Product not found' });
  } else {
    res.send(product);
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});