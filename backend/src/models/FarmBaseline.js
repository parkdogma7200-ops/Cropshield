import mongoose from "mongoose";

const farmBaselineSchema = new mongoose.Schema(
  {
    // =====================================
    // User
    // =====================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================
    // Farm Details
    // =====================================

    farmName: {
      type: String,
      required: true,
      trim: true,
    },

    farmLocation: {
      type: String,
      required: true,
      trim: true,
    },

    totalFarmSize: {
      type: Number,
      required: true,
      min: 0,
    },

    soilType: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================
    // Farming Conditions
    // =====================================

    irrigationType: {
      type: String,
      default: "",
      trim: true,
    },

    primaryCrop: {
      type: String,
      required: true,
      trim: true,
    },

    typicalAnnualYield: {
      type: Number,
      default: 0,
      min: 0,
    },

    growingSeason: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================
    // Additional Information
    // =====================================

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FarmBaseline = mongoose.model(
  "FarmBaseline",
  farmBaselineSchema
);

export default FarmBaseline;