const Router = require('express').Router

const router =  Router()
const ProductManager = require('../products/ProductManager');
const productManager = new ProductManager('./products/products.json');

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();
    if (limit) {
      res.send(products.slice(0, limit));
    } else {
      res.send(products);
    }
  });
  
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProduct(parseInt(req.params.pid));
    if (!product) {
      res.status(404).send({ error: 'Product not found' });
    } else {
      res.send(product);
    }
  });

router.post('/', async (req,res)=>{
    let producto = req.body
    let param_correcto = 'tittle/description/price/code/stock/thumbnail/status'
    if (!producto.tittle || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.status) {
        res.setHeader('Content-Type','application/json')

        return res.status(400).json({
            message: 'El body debe contener tittle, description, price, code, stock, status'
        })
        
    }
    let params = Object.keys(producto)
    for (let index = 0; index < params.length; index++) {
        const element = params[index];
        if (param_correcto.indexOf(element)=== -1) {
            return res.status(400).json({
                message: `El parametro ${element} no es un campo valido`
            })
            
        }
        

    }

    if (!producto.thubmnail) {
            producto.thubmnail = 'Agregar img'        
    }
    const product = await productManager.addProduct(producto)
    if (product) {
        return res.status(400).json({
            message:product
        })
        
    }else{
        res.status(200).json({
            message:'Producto registrado con exito'
        })
    }
    
    return 
})

router.put('/:pid', async (req,res)=>{
  let id = req.params.pid
  let producto = req.body
  let param_correcto = 'tittle/description/price/code/stock/thumbnail/status'

  let params = Object.keys(producto)
    for (let index = 0; index < params.length; index++) {
        const element = params[index];
        if (param_correcto.indexOf(element)=== -1) {
            return res.status(400).json({
                message: `El parametro ${element} no es un campo valido`
            })
            
        }        
    }
    const updates = productManager.updateProduct(id,producto)
    if (!updates) {
      return res.status(404).send({
        error:'No existe producto con ese id'
      })
      
    }
    return res.status(200).send({
      message:'Producto actualizado con exito'
    })

})

router.delete('/:pid', async (req,res)=>{
    product = productManager.deleteProduct(parseInt(req.params.pid))
    if (!product) {
        res.status(404).send({ error: 'Product not found' });
    } else {
      res.send({message:`Producto con el id ${req.params.pid} eliminado con exito` });
    }

})


module.exports=router