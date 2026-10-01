import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCropLoss,
  getCropLosses,
  getSummary,
  getGlobalHomeSummary,
} from "../controllers/cropLossController.js";

const router = express.Router();

/*
 * =========================================================
 * PUBLIC ROUTES
 * =========================================================
 */

/*
 * Global Home Page Summary
 *
 * This does NOT require login.
 * It returns overall CropShield statistics from
 * all crop-loss reports stored in MongoDB.
 */
router.get("/home-summary", getGlobalHomeSummary);


/*
 * =========================================================
 * PROTECTED ROUTES
 * =========================================================
 *
 * Everything below this point requires authentication.
 */
router.use(authMiddleware);


/*
 * Get summary for the currently logged-in farmer
 */
router.get("/summary", getSummary);


/*
 * Get all crop-loss reports belonging to the
 * currently logged-in farmer.
 *
 * POST → create a new crop-loss report
 * GET  → get the farmer's existing reports
 */
router
  .route("/")
  .get(getCropLosses)
  .post(createCropLoss);


export default router;