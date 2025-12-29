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
            image: product.image || (product.images && product.images[0]) || "",
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

const toggleTryAtHome = async (userId, productId, size) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        const newTryAtHomeState = !item.tryAtHome;

        item.tryAtHome = newTryAtHomeState;

        // If turning OFF Try-at-home, remove any additional trial sizes for this product
        if (!newTryAtHomeState) {
            cart.items = cart.items.filter(i =>
                !(i.productId.toString() === productId && i.size !== size)
            );
        }

        await cart.save();
    }
    return cart;
};

const setAdditionalSize = async (userId, productId, oldSize, newSize, productData, variantData) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    // 1. Remove existing other size if it exists
    cart.items = cart.items.filter(i =>
        !(i.productId.toString() === productId && i.size !== variantData.primarySize)
    );

    // 2. Ensure primary item has tryAtHome = true
    const primaryItem = cart.items.find(i =>
        i.productId.toString() === productId && i.size === variantData.primarySize
    );
    if (primaryItem) {
        primaryItem.tryAtHome = true;
    }

    // 3. Add the new trial size
    cart.items.push({
        productId: productId,
        title: productData.title,
        price: variantData.price,
        image: productData.image || (productData.images && productData.images[0]) || "",
        size: newSize,
        sku: variantData.sku,
        quantity: 1,
        tryAtHome: true
    });

    await cart.save();
    return cart;
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    transitionCart,
    clearCart,
    toggleTryAtHome,
    setAdditionalSize
};
