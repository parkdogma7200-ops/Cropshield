import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =====================================
    // Basic Account Information
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================
    // Farm Information
    // =====================================

    farmName: {
      type: String,
      default: "",
      trim: true,
    },

    farmLocation: {
      type: String,
      default: "",
      trim: true,
    },

    farmSize: {
      type: String,
      default: "",
      trim: true,
    },

    primaryCrop: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

