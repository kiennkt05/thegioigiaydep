const express = require('express');
const productController = require('../Controllers/specialProductsController')

const productRouter = express.Router()


productRouter.post('/', productController.createProduct)
productRouter.get('/', productController.getAllProducts)

module.exports = productRouter;
