const express = require('express');
const menProductController = require('../Controllers/menProductsController');

const menProductRouter = express.Router();

menProductRouter.post('/', menProductController.createMenProduct);
menProductRouter.get('/', menProductController.getMenProduct);

module.exports = menProductRouter;
