import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import transporter from "../config/email.js";

// =====================================
// Signup
// =====================================

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password.",
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
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

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

    // Send response
    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);

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

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
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

    // Update only the fields that were provided
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      user.email = email.toLowerCase().trim();
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

// =====================================
// Forgot Password
// =====================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email address.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Don't reveal whether an account exists
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it in MongoDB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Create password reset link
    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: `"CropShield" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "CropShield Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

          <h2 style="color: #2f6b3f;">
            CropShield Password Reset
          </h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your CropShield password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2f6b3f;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <p>
            — CropShield
          </p>

        </div>
      `,
    });

    console.log(
      `Password reset email sent to ${user.email}`
    );

    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message:
        "Unable to process the password reset request.",
    });
  }
};


// =====================================
// Reset Password
// =====================================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Please provide a new password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    // Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid and non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    // Delete reset token after successful use
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};