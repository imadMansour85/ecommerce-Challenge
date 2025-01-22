class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.products = [];
  }

  addProduct(product) {
    if (!this.products.includes(product)) {
      this.products.push(product);
    }
  }
    removeProduct(productId) {
      this.products = this.products.filter(product => product.id !== productId);
    }
}

module.exports = Category;
