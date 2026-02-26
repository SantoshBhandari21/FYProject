// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { authenticate } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
} = require("../controllers/authController");

// Register validation (matches frontend)
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["admin", "owner", "client"])
    .withMessage("Role must be admin, owner, or client"),
];

// Login validation (matches frontend)
const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", authenticate, getMe);
router.put("/password", authenticate, updatePassword);
router.put("/profile", authenticate, updateProfile);

module.exports = router;