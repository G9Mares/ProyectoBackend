const express = require('express');
const router = express.Router();
const ProductManager = require('../products/ProductManager');
const socketIO = require('socket.io');

const productManager = new ProductManager('./src/products/products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Emit the current list of products to the new client
    productManager.getProducts().then((products) => {
      socket.emit('updateProducts', products);
    });

    // Listen for product creation events and emit the updated list to all clients
    productManager.on('productCreated', (product) => {
      io.emit('updateProducts', [product]);
    });

    // Listen for product deletion events and emit the updated list to all clients
    productManager.on('productDeleted', (productId) => {
      io.emit('updateProducts', { productId });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return router;
};