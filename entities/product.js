class Product {
    constructor(id, name, price, stock) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.stock = stock;
      this.categories = [];
    }    
}

module.exports = Product;
