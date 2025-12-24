const express = require('express');
const router = express.Router();
const controller = require('../Controllers/order.controller');

router.post('/', controller.createOrder);
router.get('/:userId', controller.getUserOrders);

module.exports = router;
