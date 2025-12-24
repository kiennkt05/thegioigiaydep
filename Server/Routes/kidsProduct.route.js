const express = require('express');
const kidsProductController = require('../Controllers/kidsProductsController');

const kidsProductRouter = express.Router();

kidsProductRouter.post('/', kidsProductController.createKidsProduct);
kidsProductRouter.get('/', kidsProductController.getKidsProduct);

module.exports = kidsProductRouter;
