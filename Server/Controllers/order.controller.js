const asyncHandler = require('express-async-handler');
const orderService = require('../Services/orderService');

exports.createOrder = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
});

exports.getUserOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getUserOrders(req.params.userId);
    res.status(200).json(orders);
});
