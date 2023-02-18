const fs = require('fs');

class CartManager {
  constructor() {
    this.path = 'carts.json';
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }

  saveCarts() {
    try {
      const data = JSON.stringify(this.carts);
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.error(error);
    }
  }

  async addCart() {
    const newCart = {
      id: this.carts.length + 1,
      products: []
    };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  async getCart(cartId) {
    const cart = this.carts.find(cart => cart.id === cartId);
    if (cart) {
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }

  async addProductToCart(cartId, product) {
    const cart = await this.getCart(cartId);
    cart.products.push(product);
    this.saveCarts();
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await this.getCart(cartId);
    const productIndex = cart.products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found in cart');
    } else {
      cart.products.splice(productIndex, 1);
      this.saveCarts();
    }
  }
}