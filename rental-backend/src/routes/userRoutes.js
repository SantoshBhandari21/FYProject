// src/routes/userRoutes.js
const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const user = require("../controllers/userController");

// Logged-in user routes
router.get("/me", authenticate, user.getMyProfile);
router.put("/me", authenticate, user.updateMyProfile);
router.put("/me/password", authenticate, user.changeMyPassword);

module.exports = router;