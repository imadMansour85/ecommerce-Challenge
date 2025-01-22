class Cart {
  constructor(id) {
    this.id = id;
    this.products = [];
  }

  calculateTotal() {
      this.total = this.products.reduce((sum, product) => {
        return sum + product.price * product.quantity;
      }, 0);
    }
}

module.exports = Cart;