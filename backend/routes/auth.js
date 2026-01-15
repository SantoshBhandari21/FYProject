const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

/**
 * TEMP in-memory DB (prototype)
 * Later replace with MySQL/SQLite queries.
 */
const db = {
  users: [
    // ✅ one admin seeded (cannot be created from signup)
    // password = Admin@123
    // We'll hash it at runtime if not hashed yet.
    {
      id: "admin_1",
      name: "System Admin",
      email: "admin@demo.com",
      passwordHash: "", // filled on first run
      role: "admin",
      isActive: true,
    },
  ],

  async findUserByEmail(email) {
    return this.users.find((u) => u.email === email) || null;
  },

  async createUser(user) {
    this.users.push(user);
    return user;
  },
};

// Seed admin password hash once
(async () => {
  const admin = db.users[0];
  if (!admin.passwordHash) {
    admin.passwordHash = await bcrypt.hash("Admin@123", 10);
  }
})();

const allowedSignupRoles = ["owner", "client"]; // ✅ no admin signup

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required." });

    if (!allowedSignupRoles.includes(role))
      return res.status(400).json({ message: "Invalid role for signup." });

    const existing = await db.findUserByEmail(email.toLowerCase());
    if (existing) return res.status(409).json({ message: "Email already registered." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: `u_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role, // owner | client
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await db.createUser(user);

    return res.status(201).json({ message: "Registered successfully." });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await db.findUserByEmail(email.toLowerCase());
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    if (!user.isActive) return res.status(403).json({ message: "Account is blocked." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
