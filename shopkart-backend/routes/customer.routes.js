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
// Logout clears the cookie — keep it unauthenticated so users with an
// expired/invalid token can still log out cleanly.
router.post("/logout", logoutCustomer);

// Bonus
router.patch("/change-password", protect, changePassword);

module.exports = router;
