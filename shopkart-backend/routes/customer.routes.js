const express = require("express");

const {
  registerCustomer,
  loginCustomer,
  getMe,
  logoutCustomer,
  changePassword,
} = require("../controllers/customer.controller");

const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutCustomer);

// Bonus
router.patch("/change-password", protect, changePassword);

module.exports = router;
