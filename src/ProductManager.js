class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    const fs = require('fs');
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }

  saveProducts() {
    const fs = require('fs');
    try {
      const data = JSON.stringify(this.products);
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.error(error);
    }
  }

  addProduct(product) {
    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
    console.error(`Un producto con el código ${product.code} ya existe`);
    return false;
    }
    if (this.products.length === 0) {
      product.id = 1;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }
    this.products.push(product);
    this.saveProducts();
  }


  getProduct(id) {
    return this.products.find(product => product.id === id);
  }

  getProducts() {
    return this.products;
  }

  updateProduct(id, updates) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates
    };

    this.saveProducts();
    return true;
  }


  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    this.products.splice(productIndex, 1);
    this.saveProducts();
    return true;
  }

}

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

const updatedProduct = productManager.getProduct(1);
console.log(updatedProduct);

productManager.deleteProduct(1);
console.log(productManager.getProducts()); 
