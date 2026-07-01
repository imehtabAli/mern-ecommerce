const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPaymentAndCreateOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, isAdmin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;