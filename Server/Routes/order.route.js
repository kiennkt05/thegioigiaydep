const express = require('express');
const { createOrder, getUserOrders } = require('../Controllers/order.controller');
const validateRequest = require('../Middlewares/validateMiddleware');
const { orderCreateSchema } = require('../Validators/schemas');

const orderRouter = express.Router();

orderRouter.post('/', validateRequest(orderCreateSchema), createOrder);
orderRouter.get('/:userId', getUserOrders);

module.exports = orderRouter;
