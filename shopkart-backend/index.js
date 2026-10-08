const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

const PORT = process.env.PORT || 5050;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopKart Backend is running",
  });
});

// ======================================================
// API ROUTES
// ======================================================

// Customer Authentication
app.use("/customers", customerRoutes);

// Product APIs
app.use("/products", productRoutes);

// Wishlist APIs
app.use("/wishlist", wishlistRoutes);

// Cart APIs
app.use("/cart", cartRoutes);

// Order APIs
app.use("/orders", orderRoutes);

// ======================================================
// HANDLE UNKNOWN ROUTES
// IMPORTANT:
// This MUST stay after all API routes.
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ======================================================
// CONNECT MONGODB & START SERVER
// ======================================================

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`ShopKart server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    process.exit(1);
  }
};

startServer();