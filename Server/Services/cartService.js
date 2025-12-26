const Cart = require('../Models/cart.model');

const getCart = async (userId) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
    }
    return cart;
};

const addToCart = async (userId, product, variant, quantity) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === product._id.toString() && item.size === variant.size
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({
            productId: product._id,
            title: product.title,
            price: variant.price,
            image: product.images[0],
            size: variant.size,
            sku: variant.sku,
            quantity: quantity,
        });
    }

    await cart.save();
    return cart;
};

const updateQuantity = async (userId, productId, size, quantity) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        await cart.save();
    }
    return cart;
};

const removeFromCart = async (userId, productId, size) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(
        (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();
    return cart;
};

const transitionCart = async (guestUserId, authUserId) => {
    let guestCart = await Cart.findOne({ userId: guestUserId });
    let authCart = await Cart.findOne({ userId: authUserId });

    if (!authCart) {
        authCart = new Cart({ userId: authUserId, items: [] });
    }

    if (guestCart && guestCart.items.length > 0) {
        guestCart.items.forEach((gItem) => {
            const existingItemIndex = authCart.items.findIndex(
                (aItem) => aItem.productId.toString() === gItem.productId.toString() && aItem.size === gItem.size
            );

            if (existingItemIndex > -1) {
                authCart.items[existingItemIndex].quantity += gItem.quantity;
            } else {
                authCart.items.push(gItem);
            }
        });
        await Cart.findOneAndDelete({ userId: guestUserId });
    }

    await authCart.save();
    return authCart;
};

const clearCart = async (userId) => {
    return await Cart.findOneAndDelete({ userId });
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    transitionCart,
    clearCart
};
