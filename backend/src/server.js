import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

import connectDB from "./config/db.js";


const app = express();

const PORT = process.env.PORT || 5000;


// =====================================
// Middleware
// =====================================

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);

// =====================================
// Database
// =====================================

connectDB();


// =====================================
// Test Route
// =====================================

app.get("/", (req, res) => {
  res.json({
    message: "CropShield backend is running",
  });
});

// =====================================
// Protected Test Route
// =====================================

app.get("/api/auth/test", authMiddleware, (req, res) => {
  res.json({
    message: "JWT authentication is working!",
    userId: req.user.userId,
  });
});

// =====================================
// Start Server
// =====================================

app.listen(PORT, () => {
  console.log(
    `CropShield backend running on port ${PORT}`
  );
});