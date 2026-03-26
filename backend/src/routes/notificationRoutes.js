// src/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// All notification routes require authentication
router.use(authenticate);

// Get all notifications for user
router.get("/", getNotifications);

// Mark all notifications as read (must come before :id routes)
router.put("/all/read-all", markAllAsRead);

// Mark notification as read
router.put("/:id/read", markAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;
