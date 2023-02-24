const express = require('express');

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))

const productsRouter = require('./routes/products.router')
const cartRouter = require('./routes/carts.router')

app.use('/api/products/',productsRouter)

app.use('/api/carts/',cartRouter)

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

