const express = require('express');
const newProductController = require('../Controllers/newProductsController');

const newProductRouter = express.Router();

newProductRouter.post('/', newProductController.createNewProduct);
newProductRouter.get('/', newProductController.getcreateNewProduct);

module.exports = newProductRouter;
