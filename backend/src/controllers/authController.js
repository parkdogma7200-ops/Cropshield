import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// =====================================
// Signup
// =====================================

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Check required fields
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password.",
      });
    }

    // Validate email
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user immediately
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      message: "Server error while creating account.",
    });
  }
};

// =====================================
// Login
// =====================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Check required fields
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error while logging in.",
    });
  }
};

// =====================================
// Get Current User
// =====================================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error while getting user.",
    });
  }
};

// =====================================
// Update Current User
// =====================================

export const updateMe = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      farmName,
      farmLocation,
      farmSize,
      primaryCrop,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Update only fields that were provided
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = normalizeEmail(email);

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          message: "Please provide a valid email address.",
        });
      }

      user.email = normalizedEmail;
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (farmName !== undefined) {
      user.farmName = farmName.trim();
    }

    if (farmLocation !== undefined) {
      user.farmLocation = farmLocation.trim();
    }

    if (farmSize !== undefined) {
      user.farmSize = farmSize.trim();
    }

    if (primaryCrop !== undefined) {
      user.primaryCrop = primaryCrop.trim();
    }

    await user.save();

    res.status(200).json({
      message: "Account information updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        farmName: user.farmName,
        farmLocation: user.farmLocation,
        farmSize: user.farmSize,
        primaryCrop: user.primaryCrop,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      message: "Server error while updating account.",
    });
  }
};
