import express from "express";

import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  updateMedicineStatus,
  updateMedicineStock,
  deleteMedicine,
} from "../controllers/medicine.Controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createMedicine);

router.get("/", protect, getMedicines);

router.get("/:id", protect, getMedicineById);

router.put("/:id", protect, updateMedicine);

router.patch("/:id/status", protect, updateMedicineStatus);

router.patch("/:id/stock", protect, updateMedicineStock);

router.delete("/:id", protect, deleteMedicine);

export default router;