const express = require('express');
const { createOrder, getUserOrders } = require('../Controllers/order.controller');
const validateRequest = require('../Middlewares/validateMiddleware');
const { orderCreateSchema } = require('../Validators/schemas');

const orderRouter = express.Router();

orderRouter.post('/', validateRequest(orderCreateSchema), createOrder);
orderRouter.get('/:userId', getUserOrders);
orderRouter.post('/:id/return-request', require('../Controllers/order.controller').requestReturn);

module.exports = orderRouter;
