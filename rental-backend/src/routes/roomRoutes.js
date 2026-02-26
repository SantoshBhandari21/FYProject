// src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createRoom,
  getRooms,
  getRoomById,
  getMyRooms,
  updateRoom,
  deleteRoom,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require('../controllers/roomController');

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Owner routes
router.post('/', authenticate, authorize('owner'), upload.single('mainImage'), createRoom);
router.get('/owner/my-rooms', authenticate, authorize('owner'), getMyRooms);
router.put('/:id', authenticate, authorize('owner'), upload.single('mainImage'), updateRoom);
router.delete('/:id', authenticate, authorize('owner'), deleteRoom);

// Client routes - Favorites
router.get('/user/favorites', authenticate, authorize('client'), getFavorites);
router.post('/:id/favorite', authenticate, authorize('client'), addToFavorites);
router.delete('/:id/favorite', authenticate, authorize('client'), removeFromFavorites);

module.exports = router;