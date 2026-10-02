import express from "express";

import {
  getReportSummary,
  getSalesTrend,
  getTopMedicines,
  getSalesReport,
  getMedicineSalesReport,
  getStockReport,
  getHostelSalesReport,
  getPaymentReport,
} from "../controllers/report.Controller.js";

const router = express.Router();

// Report Summary
router.get("/summary", getReportSummary);

// Sales Trend
router.get("/sales-trend", getSalesTrend);

// Top Selling Medicines
router.get("/top-medicines", getTopMedicines);

// Sales Report
router.get("/sales", getSalesReport);

// Medicine Sales Report
router.get("/medicine-sales", getMedicineSalesReport);

// Stock Report
router.get("/stock", getStockReport);

// Hostel Sales Report
router.get("/hostel-sales", getHostelSalesReport);

// Payment Report
router.get("/payment", getPaymentReport);

export default router;
