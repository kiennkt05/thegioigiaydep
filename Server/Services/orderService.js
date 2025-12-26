const Order = require('../Models/order.model');
const Cart = require('../Models/cart.model');
const logger = require('../utils/logger');

const createOrder = async (orderData) => {
    const { userId, items, totalAmount, shippingAddress, paymentMethod = 'card' } = orderData;

    // Simulate Payment logic (Zappos-grade preparation)
    const isPaymentSuccessful = await simulatePayment(totalAmount, paymentMethod);

    if (!isPaymentSuccessful) {
        throw new Error('Payment failed. Please try again.');
    }

    const newOrder = new Order({
        userId,
        items,
        totalAmount,
        shippingAddress,
        status: 'Processing'
    });

    const savedOrder = await newOrder.save();

    // Atomically clear cart or handle stock decrement here
    await Cart.findOneAndDelete({ userId });

    logger.info(`New order created: ${savedOrder._id} for user ${userId}`);

    return savedOrder;
};

const getUserOrders = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};

// Internal Mock Payment Service
const simulatePayment = async (amount, method) => {
    logger.info(`Simulating ${method} payment for amount: $${amount}`);
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true; // Always success in mock
};

module.exports = { createOrder, getUserOrders };
