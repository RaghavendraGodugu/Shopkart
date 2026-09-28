const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

const PORT = process.env.PORT || 5050;

// ===============================
// Middleware
// ===============================

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopKart Backend is running",
  });
});

// ===============================
// API Routes
// ===============================

app.use("/customers", customerRoutes);
app.use("/products", productRoutes);

// ===============================
// Handle Unknown Routes
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ===============================
// Connect MongoDB & Start Server
// ===============================

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