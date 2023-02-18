const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const bodyParser = require('body-parser');
const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('carts.json');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/', async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails
  } = req.body;

  // Verificar que se proporcionaron todos los campos obligatorios
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Verificar que el código no se encuentra en uso
  const existingProduct = await productManager.getProductByCode(code);
  if (existingProduct) {
    return res.status(400).json({ error: 'El código del producto ya está en uso' });
  }

  // Generar un nuevo ID para el producto
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Agregar el nuevo producto al manejador
  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || []
  };
  await productManager.addProduct(newProduct);

  res.json({ message: 'Producto agregado correctamente', product: newProduct });
});

app.put('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updates = req.body;
  const success = await productManager.updateProduct(productId, updates);
  if (success) {
    res.status(200).json({ message: 'Product updated successfully' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const success = await productManager.deleteProduct(productId);
  if (success) {
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/carts/', (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Products should be an array.' });
  }

  const cart = {
    id: cartManager.generateId(),
    products
  };

  cartManager.addCart(cart);

  res.status(201).json(cart);
});


app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  // Checar si el carro existe
  const cart = cartManager.getCart(cid);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  // Checar si el producto existe
  const product = productManager.getProduct(parseInt(pid));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Checar que el producto exista en el carro 
  const existingProductIndex = cart.products.findIndex(p => p.product === pid);
  if (existingProductIndex === -1) {
    // Si el producto no existe lo añade
    cart.products.push({ product: pid, quantity });
  } else {
    //Si existe lo incrementa
    cart.products[existingProductIndex].quantity += quantity;
  }

  // Actualizar el cart
  cartManager.updateCart(cart);

  res.json({ message: 'Product added to cart' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});