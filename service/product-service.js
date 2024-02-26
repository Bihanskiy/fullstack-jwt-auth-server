const productModel = require('../models/product.model');

class ProductService {
  async findProducts() {
    const products = await productModel.find();
    return products;
  }
}

module.exports = new ProductService();