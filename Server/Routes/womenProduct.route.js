const express = require('express');
const womenProductController = require('../Controllers/womenProductsController');

const womenProductRouter = express.Router();

womenProductRouter.post('/', womenProductController.createWomensProduct);
womenProductRouter.get('/', womenProductController.getWomensProduct);

module.exports = womenProductRouter;
