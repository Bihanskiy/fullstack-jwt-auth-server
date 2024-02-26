const Router = require('express').Router;
const productController = require('../controllers/product.controller');

const router = new Router();

router.get('/products', productController.getProducts);

module.exports = router