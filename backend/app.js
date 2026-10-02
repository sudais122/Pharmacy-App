import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import setuproutes from "./routes/setup.routes.js"
import medicineroutes from "./routes/medicine.routes.js"
import salesroutes from "./routes/sale.routes.js"
import dashboardsummary from "./routes/dashboard.routes.js"
import resportroutes from "./routes/report.routes.js"
import seetingroutes from "./routes/settings.routes.js"

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/setup" ,setuproutes)
app.use("/medicines",medicineroutes);
app.use("/sales",salesroutes);
app.use("/dashboard",dashboardsummary)
app.use("/reports",resportroutes)
app.use("/seeting",seetingroutes)

export { app };
