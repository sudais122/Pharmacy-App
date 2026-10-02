
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

const REFRESH_COOKIE_NAME = "refreshToken";

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

const getClearRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate access token
    const accessToken = generateAccessToken(
      user._id.toString()
    );

    // Generate refresh token
    const refreshToken = generateRefreshToken(
      user._id.toString()
    );

    // Store refresh token in HTTP-only cookie
    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie(
      REFRESH_COOKIE_NAME,
      getClearRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};


export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Refresh access token error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token. Please login again.",
    });
  }
};
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message:
//         "If an account exists for this email, recovery instructions have been initiated.",
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to process password recovery",
//     });
//   }
// };

// export const changePassword = async (req, res) => {
//   try {
//     const {
//       currentPassword,
//       newPassword,
//       confirmPassword,
//     } = req.body;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All password fields are required",
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New passwords do not match",
//       });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be at least 8 characters",
//       });
//     }

//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const currentPasswordMatched = await bcrypt.compare(
//       currentPassword,
//       user.passwordHash
//     );

//     if (!currentPasswordMatched) {
//       return res.status(401).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     const samePassword = await bcrypt.compare(
//       newPassword,
//       user.passwordHash
//     );

//     if (samePassword) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "New password must be different from the current password",
//       });
//     }

//     user.passwordHash = await bcrypt.hash(newPassword, 12);

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     console.error("Change password error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to change password",
//     });
//   }
// };

// export const changeEmail = async (req, res) => {
//   try {
//     const { currentPassword, newEmail } = req.body;

//     if (!currentPassword || !newEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password and new email are required",
//       });
//     }

//     const normalizedEmail = newEmail.trim().toLowerCase();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(normalizedEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email address",
//       });
//     }

//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const passwordMatched = await bcrypt.compare(
//       currentPassword,
//       user.passwordHash
//     );

//     if (!passwordMatched) {
//       return res.status(401).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     if (normalizedEmail === user.email) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "New email must be different from the current email",
//       });
//     }

//     const existingUser = await User.findOne({
//       email: normalizedEmail,
//       _id: { $ne: user._id },
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email is already in use",
//       });
//     }

//     user.email = normalizedEmail;

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Email changed successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Change email error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Email is already in use",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Failed to change email",
//     });
//   }
// };