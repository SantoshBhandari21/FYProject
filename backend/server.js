// server.js
require('dotenv').config();
const app = require('./src/app');
const { initDatabase, seedDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Initialize database tables
initDatabase();

// Seed default test users
seedDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});