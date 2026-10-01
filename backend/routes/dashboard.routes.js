import express from "express";
import { getDashboard } from "../controllers/dashboard.Controller.js";

const router = express.Router();

router.get("/", getDashboard);

export default router;