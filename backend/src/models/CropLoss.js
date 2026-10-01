import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const cropLossSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cropType: { type: String, required: true, trim: true },
    otherCrop: { type: String, default: "", trim: true },
    cause: { type: String, required: true, trim: true },
    lossDate: { type: Date, required: true },
    farmLocation: { type: String, default: "", trim: true },
    affectedArea: { type: Number, required: true, min: 0 },
    estimatedLossPercent: { type: Number, required: true, min: 0, max: 100 },
    estimatedQuantity: { type: Number, default: null, min: 0 },
    quantityUnit: { type: String, default: "kg", trim: true },
    description: { type: String, default: "", trim: true },
    coordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      accuracy: { type: Number, default: null },
      capturedAt: { type: Date, default: null },
    },
    evidence: { type: [evidenceSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("CropLoss", cropLossSchema);
