const Cart = require('../Models/cart.model');
const Product = require('../Models/product.model');

// Get cart by userId
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Return empty structure if no cart exists yet
            return res.status(200).json({ userId, items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, product, variant, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item with same productId and size already exists
        const existingItemIndex = cart.items.findIndex(item =>
            item.productId.toString() === product._id && item.size === variant.size
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                productId: product._id,
                title: product.title,
                price: variant.price || product.price, // Use variant price if available
                image: product.images[0],
                size: variant.size,
                color: variant.color,
                sku: variant.sku,
                quantity: quantity
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Failed to add item to cart" });
    }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, size, quantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.productId.toString() === productId && item.size === size
        );

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // If quantity is 0 or less, remove item
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Failed to update cart item" });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId, size } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item =>
            !(item.productId.toString() === productId && item.size === size)
        );

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Failed to remove item from cart" });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        await Cart.findOneAndDelete({ userId });
        res.status(200).json({ message: "Cart cleared", items: [] });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Failed to clear cart" });
    }
};
// Transition cart from guest to user
exports.transitionCart = async (req, res) => {
    try {
        const { guestUserId, authUserId } = req.body;

        if (!guestUserId || !authUserId) {
            return res.status(400).json({ message: "Guest and Auth User IDs are required" });
        }

        // Find guest cart
        const guestCart = await Cart.findOne({ userId: guestUserId });
        if (!guestCart) {
            return res.status(200).json({ message: "No guest cart to transition" });
        }

        // Find auth user cart
        let authCart = await Cart.findOne({ userId: authUserId });

        if (!authCart) {
            // Simply update guest cart to auth user ID
            guestCart.userId = authUserId;
            await guestCart.save();
            return res.status(200).json(guestCart);
        } else {
            // Merge items
            guestCart.items.forEach(guestItem => {
                const existingItem = authCart.items.find(item =>
                    item.productId.toString() === guestItem.productId.toString() &&
                    item.size === guestItem.size
                );

                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    authCart.items.push(guestItem);
                }
            });

            await authCart.save();
            await Cart.findOneAndDelete({ userId: guestUserId });
            return res.status(200).json(authCart);
        }
    } catch (error) {
        console.error("Error transitioning cart:", error);
        res.status(500).json({ message: "Failed to transition cart", error: error.message });
    }
};
