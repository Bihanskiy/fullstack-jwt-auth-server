const productService = require("../service/product-service");

class ProductController {
  async getProducts(req, res, next) {
    try {
      const products = await productService.findProducts()
      return res.json(products);
    } catch (e) {
      next(e);
    }
  }

}

module.exports = new ProductController();