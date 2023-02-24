class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.loadProducts();
  }

  loadProducts() {
    const fs = require('fs');
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }

  saveCarts() {
    const fs = require('fs');
    try {
      const data = JSON.stringify(this.carts);
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.error(error);
    }
  }

  addCart(cart) {
    
    if (this.carts.length === 0) {
      cart.id = 1;
    } else {
      cart.id = this.carts[this.carts.length - 1].id + 1;
    }
    this.carts.push(cart);
    this.saveCarts();
  }


  getCart(id) {
    return this.carts.find(cart => cart.id === id);
  }

  getCarts() {
    return this.carts;
  }

  updateProduct(id, updates) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates
    };

    this.saveCarts();
    return true;
  }


  // deleteProduct(id) {
  //   const productIndex = this.products.findIndex(product => product.id === id);
  //   if (productIndex === -1) return false;

  //   this.products.splice(productIndex, 1);
  //   this.saveCarts();
  //   return true;
  // }

}

module.exports = CartManager;

// const productManager = new ProductManager('./products.json');
// console.log(productManager.getProducts()); // []

// productManager.addProduct({
//   title: 'producto prueba',
//   description: 'Este es un producto prueba',
//   price: 200,
//   thumbnail: 'Sin imagen',
//   code: 'abc123',
//   stock: 25
// });

// console.log(productManager.getProducts()); 

// const product = productManager.getProduct(1);
// console.log(product); 

// productManager.updateProduct(1, {
//   title: 'producto actualizado'
// });

// const updatedProduct = productManager.getProduct(1);
// console.log(updatedProduct);

// productManager.deleteProduct(1);
// console.log(productManager.getProducts()); 
