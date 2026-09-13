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

    // =====================================
    // Password Reset
    // =====================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;