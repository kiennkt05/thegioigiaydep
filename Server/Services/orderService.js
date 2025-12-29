const Order = require('../Models/order.model');
const Cart = require('../Models/cart.model');
const logger = require('../utils/logger');

const createOrder = async (orderData) => {
    const { userId, items, totalAmount, shippingAddress, tryAtHome = false, paymentMethod = 'card' } = orderData;

    // Simulate Payment logic
    const isPaymentSuccessful = await simulatePayment(totalAmount, paymentMethod);

    if (!isPaymentSuccessful) {
        throw new Error('Payment failed. Please try again.');
    }

    const pricing = {
        itemsTotal: totalAmount,
        shippingFee: 0, // Default to 0 as absorbed
        returnShippingFee: 0,
        absorbedByCompany: true // Service-first default
    };

    // Explicit Guard for Pricing Engine
    if (!pricing.absorbedByCompany) {
        pricing.shippingFee = 15; // Placeholder for non-absorbed logic
    }

    // Process items for Try-at-home (using per-item flag from cart)
    const processedItems = items.map(item => ({
        ...item,
        itemStatus: item.tryAtHome ? 'PENDING_TRY' : 'KEPT'
    }));

    const newOrder = new Order({
        userId,
        items: processedItems,
        totalAmount: pricing.itemsTotal + pricing.shippingFee,
        pricing,
        tryAtHome: processedItems.some(item => item.tryAtHome),
        returnPolicy: {
            allowed: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 365 days
            freeReturn: true,
            policyVersion: '2025-RETURN-365'
        },
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

const requestReturn = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.returnStatus !== 'NONE') {
        throw new Error('Return already requested for this order');
    }

    if (new Date() > order.returnPolicy.expiresAt) {
        throw new Error('Return policy has expired for this order (30 days)');
    }

    order.returnStatus = 'REQUESTED';
    return await order.save();
};

module.exports = { createOrder, getUserOrders, requestReturn };
