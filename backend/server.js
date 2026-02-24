const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDb } = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(port, () => console.log(`Server on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });