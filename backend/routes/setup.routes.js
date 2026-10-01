import express from "express";
import { createInitialUser } from "../controllers/setup.controller.js";

const router = express.Router();

router.post("/create-account", createInitialUser);

export default router;
