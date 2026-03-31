const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.resolve(__dirname, "./rental.db");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    process.exit(1);
  }
  console.log("Connected to database");
});

// Drop old CHECK constraint and recreate users table with correct constraint
const fixUserRoles = () => {
  db.serialize(() => {
    // Begin transaction
    db.run("BEGIN TRANSACTION");

    // Rename old users table
    db.run("ALTER TABLE users RENAME TO users_old", (err) => {
      if (err) console.error("Error renaming table:", err);
    });

    // Create new users table with correct constraints
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        profile_photo TEXT,
        role TEXT NOT NULL CHECK(role IN ('admin', 'owner', 'tenant')),
        is_verified INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error("Error creating new users table:", err);
    });

    // Copy data from old table, replacing 'client' with 'tenant'
    db.run(`
      INSERT INTO users (id, full_name, email, password, profile_photo, role, is_verified, is_active, created_at, updated_at)
      SELECT id, full_name, email, password, profile_photo, 
             CASE WHEN role = 'client' THEN 'tenant' ELSE role END as role,
             is_verified, is_active, created_at, updated_at
      FROM users_old
    `, function(err) {
      if (err) {
        console.error("Error copying users:", err);
        db.run("ROLLBACK");
      } else {
        console.log("✅ Copied and converted", this.changes, "users from 'client' to 'tenant'");
        
        // Drop old table
        db.run("DROP TABLE users_old", (err) => {
          if (err) console.error("Error dropping old table:", err);
        });

        // Commit transaction
        db.run("COMMIT", (err) => {
          if (err) {
            console.error("Error committing transaction:", err);
          } else {
            console.log("✅ All roles updated successfully!");
          }
          db.close();
        });
      }
    });
  });
};

fixUserRoles();
