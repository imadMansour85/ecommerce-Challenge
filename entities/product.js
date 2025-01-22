class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.categories = [];
  }

  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(categoryId) {
    this.categories = this.categories.filter(category => category.id !== categoryId);
  }

  
}

module.exports = Product;
