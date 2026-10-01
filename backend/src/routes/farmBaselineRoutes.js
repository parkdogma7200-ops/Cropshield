import express from "express";

import {
  saveFarmBaseline,
  getFarmBaseline,
} from "../controllers/farmBaselineController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save or update farm baseline
router.post(
  "/",
  authMiddleware,
  saveFarmBaseline
);

// Get current user's farm baseline
router.get(
  "/",
  authMiddleware,
  getFarmBaseline
);

export default router;