const express = require('express');
const newArriveController = require('../Controllers/newArriveController');

const newArriveRouter = express.Router();

newArriveRouter.post('/', newArriveController.createNewArrivals);
newArriveRouter.get('/', newArriveController.getcreateNewArrivals);

module.exports = newArriveRouter;
