import CropLoss from "../models/CropLoss.js";
import FarmBaseline from "../models/FarmBaseline.js";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const numeric = (value) =>
  value === "" || value === null || value === undefined
    ? null
    : Number(value);

const uploadsDir = path.resolve(process.cwd(), "uploads");

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
};

const saveEvidenceLocally = async (evidence, userId) => {
  await mkdir(uploadsDir, { recursive: true });

  return Promise.all(
    evidence.map(async (item) => {
      const match = item.dataUrl.match(
        /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/
      );

      if (!match || !extensions[item.mimeType]) {
        throw new Error("Invalid image data.");
      }

      const fileName = `${userId}-${crypto.randomUUID()}.${extensions[item.mimeType]}`;

      await writeFile(
        path.join(uploadsDir, fileName),
        Buffer.from(match[2], "base64")
      );

      return {
        name: item.name,
        mimeType: item.mimeType,
        url: `/uploads/${fileName}`,
      };
    })
  );
};


/* =========================================================
   CREATE CROP LOSS
========================================================= */

export const createCropLoss = async (req, res) => {
  try {
    const {
      cropType,
      otherCrop,
      cause,
      lossDate,
      farmLocation,
      affectedArea,
      estimatedLossPercent,
      estimatedQuantity,
      quantityUnit,
      description,
      coordinates,
      evidence = [],
    } = req.body;

    if (
      !cropType ||
      !cause ||
      !lossDate ||
      numeric(affectedArea) === null ||
      numeric(estimatedLossPercent) === null
    ) {
      return res.status(400).json({
        message:
          "Crop, cause, date, affected area, and estimated loss are required.",
      });
    }

    if (
      !Number.isFinite(numeric(affectedArea)) ||
      !Number.isFinite(numeric(estimatedLossPercent)) ||
      numeric(affectedArea) < 0 ||
      numeric(estimatedLossPercent) < 0 ||
      numeric(estimatedLossPercent) > 100
    ) {
      return res.status(400).json({
        message:
          "Area must be positive and loss must be between 0 and 100%.",
      });
    }

    if (
      !Array.isArray(evidence) ||
      evidence.length > 5 ||
      evidence.some(
        (item) =>
          !item.name ||
          !item.mimeType ||
          !item.dataUrl?.startsWith("data:image/")
      )
    ) {
      return res.status(400).json({
        message: "Attach up to five valid image files.",
      });
    }

    const storedEvidence = await saveEvidenceLocally(
      evidence,
      req.user.userId
    );

    const loss = await CropLoss.create({
      userId: req.user.userId,
      cropType,
      otherCrop,
      cause,
      lossDate,
      farmLocation,
      affectedArea: numeric(affectedArea),
      estimatedLossPercent: numeric(estimatedLossPercent),
      estimatedQuantity: numeric(estimatedQuantity),
      quantityUnit,
      description,
      coordinates,
      evidence: storedEvidence,
    });

    res.status(201).json({
      message: "Crop-loss report saved.",
      loss,
    });
  } catch (error) {
    console.error("Create crop loss error:", error);

    res.status(500).json({
      message: "Server error while saving the crop-loss report.",
    });
  }
};


/* =========================================================
   GET CURRENT USER'S CROP LOSSES
========================================================= */

export const getCropLosses = async (req, res) => {
  try {
    const losses = await CropLoss.find({
      userId: req.user.userId,
    }).sort({
      lossDate: -1,
      createdAt: -1,
    });

    res.json({
      losses,
    });
  } catch (error) {
    console.error("Get crop losses error:", error);

    res.status(500).json({
      message: "Server error while retrieving crop-loss reports.",
    });
  }
};


/* =========================================================
   CURRENT USER SUMMARY
========================================================= */

export const getSummary = async (req, res) => {
  try {
    const [losses, baseline] = await Promise.all([
      CropLoss.find({
        userId: req.user.userId,
      }).sort({
        lossDate: -1,
      }),

      FarmBaseline.findOne({
        userId: req.user.userId,
      }),
    ]);

    const totalAffectedArea = losses.reduce(
      (sum, loss) => sum + loss.affectedArea,
      0
    );

    const averageLossPercent = losses.length
      ? losses.reduce(
          (sum, loss) => sum + loss.estimatedLossPercent,
          0
        ) / losses.length
      : 0;

    const byCrop = losses.reduce(
      (acc, loss) => ({
        ...acc,
        [loss.cropType]: (acc[loss.cropType] || 0) + 1,
      }),
      {}
    );

    const mostAffectedCrop =
      Object.entries(byCrop).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    res.json({
      baseline,

      losses,

      summary: {
        totalReports: losses.length,
        totalAffectedArea,
        averageLossPercent,
        mostAffectedCrop,
        totalFarmSize: baseline?.totalFarmSize || 0,

        percentOfBaselineAffected: baseline?.totalFarmSize
          ? Math.min(
              (totalAffectedArea / baseline.totalFarmSize) * 100,
              100
            )
          : null,
      },
    });
  } catch (error) {
    console.error("Get summary error:", error);

    res.status(500).json({
      message: "Server error while creating your claim summary.",
    });
  }
};


/* =========================================================
   GLOBAL HOME PAGE SUMMARY
========================================================= */

/*
 * This is different from getSummary().
 *
 * getSummary()       → current logged-in user
 * getGlobalHomeSummary() → ALL users
 */

export const getGlobalHomeSummary = async (req, res) => {
  try {
    const [
      reportStats,
      evidenceStats,
      recentLoss,
      gpsLoss,
    ] = await Promise.all([

      /* ---------------------------------------------
         Overall crop-loss statistics
      --------------------------------------------- */

      CropLoss.aggregate([
        {
          $group: {
            _id: null,

            totalReports: {
              $sum: 1,
            },

            totalAffectedArea: {
              $sum: "$affectedArea",
            },

            averageLossPercent: {
              $avg: "$estimatedLossPercent",
            },
          },
        },
      ]),


      /* ---------------------------------------------
         Total evidence images
      --------------------------------------------- */

      CropLoss.aggregate([
        {
          $project: {
            evidenceCount: {
              $size: "$evidence",
            },
          },
        },

        {
          $group: {
            _id: null,

            totalEvidence: {
              $sum: "$evidenceCount",
            },
          },
        },
      ]),


      /* ---------------------------------------------
         Most recent crop-loss report
      --------------------------------------------- */

      CropLoss.findOne()
        .sort({
          lossDate: -1,
          createdAt: -1,
        })
        .lean(),


      /* ---------------------------------------------
         Most recent report with GPS coordinates
      --------------------------------------------- */

      CropLoss.findOne({
        "coordinates.latitude": {
          $ne: null,
        },

        "coordinates.longitude": {
          $ne: null,
        },
      })
        .sort({
          "coordinates.capturedAt": -1,
          lossDate: -1,
        })
        .lean(),
    ]);


    const stats = reportStats[0] || {};
    const evidence = evidenceStats[0] || {};


    /* ---------------------------------------------
       Send data to Home.jsx
    --------------------------------------------- */

    res.json({
      summary: {
        totalReports: stats.totalReports || 0,

        totalAffectedArea: stats.totalAffectedArea || 0,

        averageLossPercent: stats.averageLossPercent || 0,

        totalEvidence: evidence.totalEvidence || 0,
      },

      recentLoss: recentLoss || null,

      gpsLoss: gpsLoss || null,
    });

  } catch (error) {
    console.error("Global home summary error:", error);

    res.status(500).json({
      message:
        "Server error while retrieving the global home summary.",
    });
  }
};