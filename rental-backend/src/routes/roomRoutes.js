// src/routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createRoom,
  getRooms,
  getRoomById,
  getMyRooms,
  updateRoom,
  deleteRoom,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} = require("../controllers/roomController");

// Owner routes - MUST come before :id routes
router.get("/owner/my-rooms", authenticate, authorize("owner"), getMyRooms);
router.post(
  "/",
  authenticate,
  authorize("owner"),
  upload.single("mainImage"),
  createRoom,
);

// Client routes - Favorites - MUST come before :id routes
router.get("/user/favorites", authenticate, authorize("client"), getFavorites);

// Public routes
router.get("/", getRooms);

// ID-based routes - MUST come after specific routes
router.get("/:id", getRoomById);
router.put(
  "/:id",
  authenticate,
  authorize("owner"),
  upload.single("mainImage"),
  updateRoom,
);
router.delete("/:id", authenticate, authorize("owner"), deleteRoom);
router.post("/:id/favorite", authenticate, authorize("client"), addToFavorites);
router.delete(
  "/:id/favorite",
  authenticate,
  authorize("client"),
  removeFromFavorites,
);

module.exports = router;
