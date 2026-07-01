const Razorpay = require('razorpay');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Product = require('../models/productModel');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          message: "One of the products in your cart no longer exists. Please remove it."
        });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} left.`
        });
      }
    }

    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      cartItems: cart.items,
    });

  } catch (error) {
    console.log("FULL ERROR:", error);
    const message = error.error?.description || error.message || "Something went wrong.";
    res.status(500).json({ message });
  }
};

exports.verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    console.log("Backend secret:", process.env.RAZORPAY_KEY_SECRET);
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Generated signature:", generatedSignature);
    console.log("Received signature:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const invalidItem = cart.items.find((item) => !item.product);
    if (invalidItem) {
      return res.status(400).json({
        message: "One or more products in your cart no longer exist. Please remove them."
      });
    }

    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      orderStatus: 'processing',
    });
    await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmation',
      html: `<h2>Thank you for your order!</h2>
         <p>Your order of ₹${totalAmount} has been placed successfully.</p>
         <p>Order ID: ${order._id}</p>`,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully.", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders of logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view this order." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin updates order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};