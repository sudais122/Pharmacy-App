import express from "express";

import {
  createSale,
  getSales,
  getSaleById,
} from "../controllers/sale.Controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-sale", protect, createSale);

router.get("/getallsales", protect, getSales);

router.get("/:id", protect, getSaleById);

export default router;