
import express from "express";

import {
  getAccountInformation,
  getPharmacyInformation,
  updatePharmacyInformation,
} from "../controllers/settings.Controller";

const router = express.Router();

router.get("/account", getAccountInformation);

router.get("/pharmacy", getPharmacyInformation);

router.put("/pharmacy", updatePharmacyInformation);

export default router;
