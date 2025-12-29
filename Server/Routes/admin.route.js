const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
// const { protect, admin } = require('../Middlewares/authMiddleware'); // For later if we want strict auth

router.get('/stats', adminController.getStats);
router.get('/service-analytics', adminController.getServiceAnalytics);
router.get('/returns', adminController.getReturnRequests);
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Unified product management via admin
router.get('/products', adminController.getAllProductsAdmin);
router.post('/products', adminController.createProductAdmin);
router.patch('/products/:id', adminController.updateProductAdmin);
router.delete('/products/:id', adminController.deleteProductAdmin);

module.exports = router;
