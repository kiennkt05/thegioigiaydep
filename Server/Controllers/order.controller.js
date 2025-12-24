const Order = require('../Models/order.model');
const Cart = require('../Models/cart.model');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cannot place an empty order" });
        }

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            shippingAddress
        });

        const savedOrder = await newOrder.save();

        // Clear the cart for this user after successful order placement
        await Cart.findOneAndDelete({ userId });

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

// Get orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};
