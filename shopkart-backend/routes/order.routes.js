const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
} = require("../controllers/order.controller");

const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// Create ShopKart order + Razorpay order
router.post(
  "/create-payment-order",
  protect,
  createPaymentOrder
);

// Verify Razorpay payment
router.post(
  "/verify-payment",
  protect,
  verifyPayment
);

// Get all orders of logged-in customer
router.get(
  "/",
  protect,
  getOrders
);

// Get one order
router.get(
  "/:id",
  protect,
  getOrderById
);

module.exports = router;