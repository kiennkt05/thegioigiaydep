const express = require('express');
const router = express.Router();
const controller = require('../Controllers/cart.controller');

router.get('/:userId', controller.getCart);
router.post('/add', controller.addToCart);
router.put('/update', controller.updateCartItem);
router.post('/remove', controller.removeFromCart);
router.post('/transition', controller.transitionCart);
router.post('/clear', controller.clearCart);

module.exports = router;
