
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

const COOKIE_NAME = "token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
});

export const createInitialUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters"
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters"
      });
    }

    const existingUser = await User.findOne();

    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "Application has already been initialized"
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      isActive: true
    });

    const token = generateToken(
      user._id.toString()
    );

    res.cookie(
      COOKIE_NAME,
      token,
      getCookieOptions()
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(
      "Create initial user error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create account"
    });
  }
};
