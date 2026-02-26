// src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getBookingRequests,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  completeBooking,
  addReview,
  getOwnerStats
} = require('../controllers/bookingController');

// Client routes
router.post('/', authenticate, authorize('client'), createBooking);
router.get('/my-bookings', authenticate, authorize('client'), getMyBookings);
router.put('/:id/cancel', authenticate, authorize('client'), cancelBooking);
router.post('/:id/review', authenticate, authorize('client'), addReview);

// Owner routes
router.get('/requests', authenticate, authorize('owner'), getBookingRequests);
router.put('/:id/status', authenticate, authorize('owner'), updateBookingStatus);
router.put('/:id/complete', authenticate, authorize('owner'), completeBooking);
router.get('/stats/dashboard', authenticate, authorize('owner'), getOwnerStats);

// Shared routes (client and owner can view their bookings)
router.get('/:id', authenticate, getBookingById);

module.exports = router;