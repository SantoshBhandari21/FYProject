// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { runQuery, getOne } = require("../config/database");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ------------------------------
// REGISTER
// POST /api/auth/register
// Body expected: { name, email, password, role }
// ------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please provide name, email, password, and role",
      });
    }

    const validRoles = ["admin", "owner", "client"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be admin, owner, or client",
      });
    }

    const existingUser = await getOne("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await runQuery(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    const user = await getOne(
      `SELECT id, full_name, email, role, is_verified, is_active, created_at
       FROM users WHERE id = ?`,
      [result.id]
    );

    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: error.message || "Server error during registration",
    });
  }
};

// ------------------------------
// LOGIN
// POST /api/auth/login
// Body expected: { email, password }
// ------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await getOne("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.is_active !== undefined && !user.is_active) {
      return res.status(401).json({
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.role);

    delete user.password;

    return res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: error.message || "Server error during login",
    });
  }
};

// ------------------------------
// GET ME
// GET /api/auth/me
// ------------------------------
const getMe = async (req, res) => {
  try {
    const user = await getOne(
      `SELECT id, full_name, email, role, is_verified, is_active, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ------------------------------
// UPDATE PASSWORD
// PUT /api/auth/password
// ------------------------------
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide current and new password",
      });
    }

    const user = await getOne("SELECT password FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await runQuery(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ------------------------------
// UPDATE PROFILE
// PUT /api/auth/profile
// Only fullName (since you removed phone/address)
// ------------------------------
const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "fullName is required" });
    }

    await runQuery(
      "UPDATE users SET full_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [fullName, req.user.id]
    );

    const user = await getOne(
      `SELECT id, full_name, email, role, is_verified, is_active, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    return res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
};