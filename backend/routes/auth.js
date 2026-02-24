const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get, run } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function makeToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Only allow owner/client from signup UI (prevents anyone creating admin)
    const safeRole = role === "owner" ? "owner" : "client";

    const existing = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    const result = await run(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, hash, safeRole]
    );

    return res.status(201).json({ message: "Registered", userId: result.lastID });
  }  catch (e) {
  console.log("==== REGISTER ERROR START ====");
  console.log(e);
  console.log("Message:", e.message);
  console.log("Stack:", e.stack);
  console.log("Body:", req.body);
  console.log("==== REGISTER ERROR END ====");
  return res.status(500).json({ message: e.message || "Server error" });
}
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await get(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
      [email]
    );

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = makeToken(user);

    // IMPORTANT: your frontend expects user.role
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e){
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const user = await get("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.userId]);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
});

module.exports = router;