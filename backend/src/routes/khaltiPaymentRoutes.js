// src/routes/khaltiPaymentRoutes.js
const express = require("express");
const router = express.Router();

const khaltiPaymentController = require("../controllers/khaltiPaymentController");
const authMiddleware = require("../middleware/auth");

// Initiate payment - requires authentication
router.post(
  "/initiate",
  authMiddleware.authenticate,
  authMiddleware.authorize("tenant"),
  khaltiPaymentController.initiatePayment,
);

// Verify payment - callback from Khalti (no authentication required)
router.get("/verify", khaltiPaymentController.verifyPayment);

// Get all my payments (tenant) - must be before /:bookingId route
router.get(
  "/my-payments",
  authMiddleware.authenticate,
  authMiddleware.authorize("tenant"),
  khaltiPaymentController.getMyPayments,
);

// Get payment status by pidx
router.get(
  "/status/:pidx",
  authMiddleware.authenticate,
  khaltiPaymentController.getPaymentStatus,
);

// Get payment by booking ID
router.get(
  "/booking/:bookingId",
  authMiddleware.authenticate,
  khaltiPaymentController.getPaymentByBooking,
);

module.exports = router;

