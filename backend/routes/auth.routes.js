
import express from "express";

import {
  login,
  getCurrentUser,
  logout,
  changePassword,
  changeEmail
} from "../controllers/auth.Controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
router.post("/logout", logout);

router.get("/me", protect, getCurrentUser);
router.put("/change-password", protect, changePassword);
router.put("/change-email", protect, changeEmail);

export default router;
