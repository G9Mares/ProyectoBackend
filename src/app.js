const express = require('express');


const engine = require('express-handlebars').engine

const ProductManager = require('./products/ProductManager');
const productManager = new ProductManager('./src/products/products.json');

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

const productsRouter = require('./routes/products.router')
const cartRouter = require('./routes/carts.router')
const realTime = require('./routes/realtime.router')


app.use('/api/products/',productsRouter)

app.use('/api/carts/',cartRouter)
app.use('/realTimeProducts',realTime)

app.get('/', (req, res) => {
  const products =  productManager.getProducts();
  console.log(products)
  res.render('home', { products });
});

// app.use(express.static('./src/public'))



const server =app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

