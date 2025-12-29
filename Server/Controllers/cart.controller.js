const asyncHandler = require('express-async-handler');
const cartService = require('../Services/cartService');

exports.getCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const cart = await cartService.getCart(userId);
    res.status(200).json(cart);
});

exports.addToCart = asyncHandler(async (req, res) => {
    const { userId, product, variant, quantity } = req.body;
    const cart = await cartService.addToCart(userId, product, variant, quantity);
    res.status(200).json(cart);
});

exports.updateCartItem = asyncHandler(async (req, res) => {
    const { userId, productId, size, quantity } = req.body;
    const cart = await cartService.updateQuantity(userId, productId, size, quantity);
    res.status(200).json(cart);
});

exports.removeFromCart = asyncHandler(async (req, res) => {
    const { userId, productId, size } = req.body;
    const cart = await cartService.removeFromCart(userId, productId, size);
    res.status(200).json(cart);
});

exports.transitionCart = asyncHandler(async (req, res) => {
    const { guestUserId, authUserId } = req.body;
    const cart = await cartService.transitionCart(guestUserId, authUserId);
    res.status(200).json(cart);
});

exports.clearCart = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    await cartService.clearCart(userId);
    res.status(200).json({ message: "Cart cleared" });
});

exports.toggleTryAtHome = asyncHandler(async (req, res) => {
    const { userId, productId, size } = req.body;
    const cart = await cartService.toggleTryAtHome(userId, productId, size);
    res.status(200).json(cart);
});

exports.setAdditionalSize = asyncHandler(async (req, res) => {
    const { userId, productId, oldSize, newSize, productData, variantData } = req.body;
    const cart = await cartService.setAdditionalSize(userId, productId, oldSize, newSize, productData, variantData);
    res.status(200).json(cart);
});
