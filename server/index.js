require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors()); // allows the React app (different port) to call this API
app.use(express.json()); // parses incoming JSON request bodies

// --- Routes ---
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Student Management API is running");
});

// --- Connect to MongoDB, then start the server ---
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
