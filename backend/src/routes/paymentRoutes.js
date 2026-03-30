// src/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  initiatePayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentByBooking,
} = require("../controllers/paymentController");

// Client routes - Initiate payment
router.post("/initiate", authenticate, authorize("client"), initiatePayment);

// Verify payment callback from eSewa
router.get("/verify", verifyPayment);

// Get payment status
router.get("/status/:transactionUUID", authenticate, getPaymentStatus);

// Get payment by booking ID
router.get("/booking/:bookingId", authenticate, getPaymentByBooking);

module.exports = router;
