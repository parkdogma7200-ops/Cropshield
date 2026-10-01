import express from "express";

import {
  signup,
  login,
  getMe,
  updateMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// Account Creation
// =====================================

router.post("/signup", signup);

// =====================================
// Login
// =====================================

router.post("/login", login);

// =====================================
// Current User
// =====================================

router.get("/me", authMiddleware, getMe);

// =====================================
// Update Current User
// =====================================

router.put("/me", authMiddleware, updateMe);

export default router;
