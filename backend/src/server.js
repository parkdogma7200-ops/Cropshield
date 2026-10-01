import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import path from "node:path";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import farmBaselineRoutes from "./routes/farmBaselineRoutes.js";
import cropLossRoutes from "./routes/cropLossRoutes.js";

import connectDB from "./config/db.js";


const app = express();

const PORT = process.env.PORT || 5000;


// =====================================
// Middleware
// =====================================

app.use(cors());

app.use(express.json({ limit: "12mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/farm-baseline", farmBaselineRoutes);
app.use("/api/crop-losses", cropLossRoutes);

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
