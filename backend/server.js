require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // Vite default port
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Backend running"));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
