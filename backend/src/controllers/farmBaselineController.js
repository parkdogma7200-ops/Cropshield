import FarmBaseline from "../models/FarmBaseline.js";

// =====================================
// Create / Update Farm Baseline
// =====================================

export const saveFarmBaseline = async (req, res) => {
  try {
    const {
      farmName,
      farmLocation,
      totalFarmSize,
      soilType,
      irrigationType,
      primaryCrop,
      typicalAnnualYield,
      growingSeason,
      notes,
    } = req.body;

    // =====================================
    // Validate required fields
    // =====================================

    if (
      !farmName ||
      !farmLocation ||
      totalFarmSize === undefined ||
      !primaryCrop
    ) {
      return res.status(400).json({
        message:
          "Farm name, farm location, farm size, and primary crop are required.",
      });
    }

    // =====================================
    // Check whether baseline already exists
    // =====================================

    let baseline = await FarmBaseline.findOne({
      userId: req.user.userId,
    });

    // =====================================
    // Create new baseline
    // =====================================

    if (!baseline) {
      baseline = new FarmBaseline({
        userId: req.user.userId,
      });
    }

    // =====================================
    // Update baseline information
    // =====================================

    baseline.farmName = farmName.trim();
    baseline.farmLocation = farmLocation.trim();
    baseline.totalFarmSize = Number(totalFarmSize);
    baseline.soilType = soilType || "";
    baseline.irrigationType = irrigationType || "";
    baseline.primaryCrop = primaryCrop;
    baseline.typicalAnnualYield =
      typicalAnnualYield === ""
        ? 0
        : Number(typicalAnnualYield);
    baseline.growingSeason = growingSeason || "";
    baseline.notes = notes || "";

    await baseline.save();

    res.status(200).json({
      message: "Farm baseline saved successfully.",
      baseline,
    });
  } catch (error) {
    console.error("Save farm baseline error:", error);

    res.status(500).json({
      message: "Server error while saving farm baseline.",
    });
  }
};

// =====================================
// Get Current User's Farm Baseline
// =====================================

export const getFarmBaseline = async (req, res) => {
  try {
    const baseline = await FarmBaseline.findOne({
      userId: req.user.userId,
    });

    if (!baseline) {
      return res.status(404).json({
        message: "Farm baseline not found.",
      });
    }

    res.status(200).json({
      baseline,
    });
  } catch (error) {
    console.error("Get farm baseline error:", error);

    res.status(500).json({
      message: "Server error while retrieving farm baseline.",
    });
  }
};