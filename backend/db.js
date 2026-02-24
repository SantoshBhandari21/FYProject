const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const { get, run } = require("../db");
require("dotenv").config();

const dbFile = process.env.DB_FILE || "./data/myrentals.db";

// Make an absolute path from backend folder
const absPath = path.resolve(process.cwd(), dbFile);
const dir = path.dirname(absPath);

console.log("DB_FILE from env:", process.env.DB_FILE);
console.log("Resolved DB path:", absPath);

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new sqlite3.Database(absPath, (err) => {
  if (err) console.error("SQLite open error:", err.message);
  else console.log("SQLite opened successfully");
});

// Promisified helpers
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function initDb() {
  console.log("Initializing database (creating tables)...");
  await run("PRAGMA journal_mode=WAL;"); // forces write & creates file
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin','owner','client')) DEFAULT 'client',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  console.log("Database initialized OK.");
}

module.exports = { db, run, initDb };