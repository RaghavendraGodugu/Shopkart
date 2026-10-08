const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

// ==========================================
// ADD PRODUCT TO CART
// POST /cart/:productId
// ==========================================

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find customer
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Make sure cart exists
    if (!customer.cart) {
      customer.cart = [];
    }

    // Check if product already exists in cart
    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      // Since we are adding ONE more item,
      // we need one more unit of stock.

      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }

      cartItem.quantity += 1;
    } else {
      // Product is not currently in cart
      customer.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    // ==========================================
    // DECREASE PRODUCT STOCK
    // ==========================================

    product.stock -= 1;

    // Save both documents
    await product.save();
    await customer.save();

    // Populate product information
    await customer.populate({
      path: "cart.product",
      select: "name description price category image stock",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: customer.cart,
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// ==========================================
// GET CURRENT USER CART
// GET /cart
// ==========================================

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id)
      .select("cart")
      .populate({
        path: "cart.product",
        select: "name description price category image stock",
      });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      cart: customer.cart || [],
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

// ==========================================
// UPDATE CART QUANTITY
// PATCH /cart/:productId
// ==========================================

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Validate quantity
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find customer
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find cart item
    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const oldQuantity = cartItem.quantity;

    // Difference between requested and current quantity
    const difference = quantity - oldQuantity;

    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    if (difference > 0) {
      // Need additional stock
      if (product.stock < difference) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} additional units available`,
        });
      }

      product.stock -= difference;
    }

    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    if (difference < 0) {
      // Return unused units to stock
      product.stock += Math.abs(difference);
    }

    // Update cart quantity
    cartItem.quantity = quantity;

    // Save
    await product.save();
    await customer.save();

    // Populate
    await customer.populate({
      path: "cart.product",
      select: "name description price category image stock",
    });

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: customer.cart,
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// ==========================================
// REMOVE PRODUCT FROM CART
// DELETE /cart/:productId
// ==========================================

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find customer
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find cart item
    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // RETURN CART QUANTITY TO STOCK
    // ==========================================

    product.stock += cartItem.quantity;

    // Remove product from cart
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    // Save
    await product.save();
    await customer.save();

    // Populate
    await customer.populate({
      path: "cart.product",
      select: "name description price category image stock",
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: customer.cart,
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Remove cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
};