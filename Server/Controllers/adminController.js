const Order = require('../Models/order.model');
const Product = require('../Models/product.model');
const User = require('../Models/user.model');
const asyncHandler = require('express-async-handler');
const { auditLogger } = require('../utils/monitoring');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalUsers,
        totalProducts
    });
});

// @desc    Get Zappos-style service analytics
// @route   GET /api/admin/service-analytics
const getServiceAnalytics = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    const totalOrders = orders.length;

    if (totalOrders === 0) {
        return res.json({
            returnRate: 0,
            tryAtHomeRate: 0,
            slaFulfillmentRate: 100,
            totalAbsorbedShipping: 0
        });
    }

    const returnedOrders = orders.filter(o => o.returnStatus !== 'NONE' && o.returnStatus !== 'CANCELLED').length;
    const tryAtHomeOrders = orders.filter(o => o.tryAtHome).length;
    const absorbedShipping = orders.reduce((acc, o) => acc + (o.pricing?.shippingFee || 0), 0);

    // Mock SLA fulfillment (in a real app, this would compare delivery date with SLA)
    const slaFulfilled = orders.filter(o => o.status === 'delivered').length;

    res.json({
        returnRate: ((returnedOrders / totalOrders) * 100).toFixed(1),
        tryAtHomeRate: ((tryAtHomeOrders / totalOrders) * 100).toFixed(1),
        slaFulfillmentRate: ((slaFulfilled / totalOrders) * 100).toFixed(1) || 100,
        totalAbsorbedShipping: absorbedShipping,
        orderVolume: totalOrders
    });
});

// @desc    Get all active return requests
// @route   GET /api/admin/returns
const getReturnRequests = asyncHandler(async (req, res) => {
    const returns = await Order.find({
        returnStatus: { $ne: 'NONE' }
    }).sort({ updatedAt: -1 });
    res.json(returns);
});

// @desc    Get all orders
// @route   GET /api/admin/orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        const oldStatus = order.status;
        order.status = status;
        const updatedOrder = await order.save();
        auditLogger('UPDATE_ORDER_STATUS', { orderId: order._id, oldStatus, newStatus: status });
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all products (Admin view)
// @route   GET /api/admin/products
const getAllProductsAdmin = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

// @desc    Create product
// @route   POST /api/admin/products
const createProductAdmin = asyncHandler(async (req, res) => {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    auditLogger('CREATE_PRODUCT', { productId: createdProduct._id, title: createdProduct.title });
    res.status(201).json(createdProduct);
});

// @desc    Update product
// @route   PATCH /api/admin/products/:id
const updateProductAdmin = asyncHandler(async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (updatedProduct) {
        auditLogger('UPDATE_PRODUCT', { productId: updatedProduct._id, title: updatedProduct.title });
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
const deleteProductAdmin = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
        auditLogger('DELETE_PRODUCT', { productId: product._id, title: product.title });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getStats,
    getServiceAnalytics,
    getReturnRequests,
    getAllOrders,
    updateOrderStatus,
    getAllProductsAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin
};
