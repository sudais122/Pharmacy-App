console.log("NODE_ENV:", process.env.NODE_ENV);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

// Auth
app.use("/auth", authRoutes);

// Medicines
app.use("/medicines", medicineRoutes);

// Sales
app.use("/sales", saleRoutes);

// Dashboard
app.use("/dashboard", dashboardRoutes);

// Reports
app.use("/reports", reportRoutes);

// Settings
app.use("/settings", settingsRoutes);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err);

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };