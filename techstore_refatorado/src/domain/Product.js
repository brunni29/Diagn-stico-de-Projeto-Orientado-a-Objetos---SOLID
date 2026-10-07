class Product {
  constructor(id, name, category, price, weight, stock) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.weight = weight;
    this.stock = stock;
  }

  hasStock(quantity) {
    return this.stock >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.hasStock(quantity)) {
      throw new Error(`Estoque insuficiente para ${this.name}.`);
    }
    this.stock -= quantity;
  }
}

module.exports = Product;
