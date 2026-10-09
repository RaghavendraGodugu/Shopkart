const crypto = require("crypto");
const mongoose = require("mongoose");

const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");

// ----------------------------------------------------
// Helper: Validate shipping address
// ----------------------------------------------------
const validateShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== "object") {
    return "Shipping address is required";
  }

  const {
    fullName,
    phone,
    addressLine1,
    city,
    state,
    pincode,
  } = shippingAddress;

  if (!fullName?.trim()) {
    return "Full name is required";
  }

  if (!phone?.trim()) {
    return "Phone number is required";
  }

  if (!/^[6-9]\d{9}$/.test(phone.trim())) {
    return "Enter a valid 10-digit Indian phone number";
  }

  if (!addressLine1?.trim()) {
    return "Address is required";
  }

  if (!city?.trim()) {
    return "City is required";
  }

  if (!state?.trim()) {
    return "State is required";
  }

  if (!pincode?.trim()) {
    return "Pincode is required";
  }

  if (!/^\d{6}$/.test(pincode.trim())) {
    return "Pincode must contain exactly 6 digits";
  }

  return null;
};

// ----------------------------------------------------
// CREATE RAZORPAY PAYMENT ORDER
// POST /orders/create-payment-order
// ----------------------------------------------------
const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // -----------------------------------------------
    // 1. Validate shipping address
    // -----------------------------------------------
    const shippingError = validateShippingAddress(
      req.body.shippingAddress
    );

    if (shippingError) {
      return res.status(400).json({
        success: false,
        message: shippingError,
      });
    }

    // -----------------------------------------------
    // 2. Get current user's cart
    // -----------------------------------------------
    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // -----------------------------------------------
    // 3. Get latest product information from DB
    // -----------------------------------------------
    const productIds = customer.cart.map(
      (item) => item.product
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    // -----------------------------------------------
    // 4. Validate products, stock and build snapshot
    // -----------------------------------------------
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
      const productId = cartItem.product.toString();
      const product = productMap.get(productId);

      // Product deleted or unavailable
      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "One of the products in your cart is no longer available",
        });
      }

      const quantity = Number(cartItem.quantity);

      // Invalid quantity
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // ---------------------------------------------
      // Final stock verification
      // NOTE: cart quantities are already reserved (deducted from
      // product.stock) at add-to-cart time, so product.stock here is
      // the remainder AFTER this cart's own reservation. Comparing
      // `quantity > product.stock` directly would falsely reject
      // legitimate bulk carts (e.g. 6 units in cart, 4 remaining).
      // Only fail if stock went negative (manual edit / race).
      // ---------------------------------------------
      if (product.stock < 0) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      const price = Number(product.price);

      // Calculate using latest DB price
      totalAmount += price * quantity;

      // ---------------------------------------------
      // Snapshot product information
      // ---------------------------------------------
      orderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        quantity: quantity,
        image: product.image || "",
      });
    }

    // -----------------------------------------------
    // Round total to 2 decimal places
    // -----------------------------------------------
    totalAmount = Number(totalAmount.toFixed(2));

    // -----------------------------------------------
    // 5. Create ShopKart pending order
    // -----------------------------------------------
    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress: {
        fullName: req.body.shippingAddress.fullName.trim(),
        phone: req.body.shippingAddress.phone.trim(),
        addressLine1:
          req.body.shippingAddress.addressLine1.trim(),
        city: req.body.shippingAddress.city.trim(),
        state: req.body.shippingAddress.state.trim(),
        pincode: req.body.shippingAddress.pincode.trim(),
      },

      totalAmount,

      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    // -----------------------------------------------
    // 6. Create Razorpay order
    // -----------------------------------------------
    const razorpayAmount = Math.round(totalAmount * 100);

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: razorpayAmount,
        currency: "INR",
        receipt: order._id.toString(),
      });

      // ---------------------------------------------
      // 7. Save Razorpay order ID
      // ---------------------------------------------
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      // ---------------------------------------------
      // 8. Send safe response to frontend
      // ---------------------------------------------
      return res.status(201).json({
        success: true,
        message: "Payment order created successfully",

        shopKartOrderId: order._id,

        razorpayOrderId: razorpayOrder.id,

        amount: razorpayAmount,

        currency: "INR",

        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (razorpayError) {
      // If Razorpay creation fails,
      // remove the pending ShopKart order.
      await Order.findByIdAndDelete(order._id);

      console.error(
        "Razorpay order creation error:",
        razorpayError
      );

      return res.status(500).json({
        success: false,
        message: "Unable to create Razorpay payment order",
      });
    }
  } catch (error) {
    console.error(
      "Create payment order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// ----------------------------------------------------
// VERIFY RAZORPAY PAYMENT
// POST /orders/verify-payment
// ----------------------------------------------------
const verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // -----------------------------------------------
    // 1. Validate required fields
    // -----------------------------------------------
    if (
      !shopKartOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    // -----------------------------------------------
    // 2. Validate MongoDB Order ID
    // -----------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ShopKart order ID",
      });
    }

    // -----------------------------------------------
    // 3. Find order belonging to logged-in user
    // -----------------------------------------------
    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -----------------------------------------------
    // 4. Idempotency
    // -----------------------------------------------
    if (order.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // -----------------------------------------------
    // 5. Verify Razorpay order ID
    // -----------------------------------------------
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID does not match",
      });
    }

    // -----------------------------------------------
    // 6. Generate expected signature
    // -----------------------------------------------
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${order.razorpayOrderId}|${razorpay_payment_id}`
      )
      .digest("hex");

    // -----------------------------------------------
    // 7. Secure signature comparison
    // -----------------------------------------------
    const generatedBuffer =
      Buffer.from(generatedSignature);

    const receivedBuffer =
      Buffer.from(razorpay_signature);

    const signatureIsValid =
      generatedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(
        generatedBuffer,
        receivedBuffer
      );

    if (!signatureIsValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // -----------------------------------------------
    // 8. Mark payment as PAID
    // -----------------------------------------------
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    // -----------------------------------------------
    // 9. Clear cart ONLY after successful verification
    // -----------------------------------------------
    const customer = await Customer.findById(userId);

    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    // -----------------------------------------------
    // 10. Return success
    // -----------------------------------------------
    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// ----------------------------------------------------
// GET ALL ORDERS OF CURRENT USER
// GET /orders
// ----------------------------------------------------
const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// ----------------------------------------------------
// GET SINGLE ORDER
// GET /orders/:id
// ----------------------------------------------------
const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // -----------------------------------------------
    // Validate ID
    // -----------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // -----------------------------------------------
    // Find order belonging to current user
    // -----------------------------------------------
    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
};