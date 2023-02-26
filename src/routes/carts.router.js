const Router = require('express').Router

const router = Router()
const CartManager = require('../carts/CartManager')
const cartManager = new CartManager('./src/carts/carts.json')


router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCart(parseInt(req.params.cid));
    res.setHeader('Content-Type','application/json')
    if (!cart) {
      res.status(404).send({ error: 'cart not found' });
    } else {
      res.send(cart);
    }
  });

router.post('/',async (req,res)=>{
    let cart = req.body
    const params_correcto = 'productId//quantity'
    res.setHeader('Content-Type','application/json')
    if (!cart.products || !Array.isArray(cart.products)) {
        return res.status(404).send(
            {error:'Se debe enviar los productos en forma de lista con productId:"", quantity:""'}
        )
        
    }
    for (let index = 0; index < cart.products.length; index++) {
        const producto = cart.products[index];
        let params = Object.keys(producto)
        for (let indice = 0; indice < params.length; indice++) {
            const element = params[indice];
            if (params_correcto.indexOf(element)===-1) {
                return res.status(404).send(
                    {error:`En el producto ${index+1} agregaste incorrecgtamente la propiedad ${element} `}
                )
                
            }
        }
    }
    cartManager.addCart(cart)
    return res.status(200).send({
        message:'Carrito creado con exito'
    })

})

module.exports = router