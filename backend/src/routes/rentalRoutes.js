// src/routes/rentalRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  createRental,
  getMyRentals,
  getRentalRequests,
  getRentalById,
} = require("../controllers/rentalController");

// Tenant routes
router.post("/", authenticate, authorize("tenant"), createRental);
router.get("/my-rentals", authenticate, authorize("tenant"), getMyRentals);
router.get("/requests", authenticate, authorize("owner"), getRentalRequests);

// Get rental details
router.get("/:id", authenticate, getRentalById);

module.exports = router;
