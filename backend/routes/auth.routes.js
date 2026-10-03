
import express from "express";

import {
  login,
  getCurrentUser,
  logout,
  refreshAccessToken
} from "../controllers/auth.Controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
