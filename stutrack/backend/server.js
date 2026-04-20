import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

/* ROUTES */
import admissionRoutes from "./routes/admissionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import feesRoutes from "./routes/feesRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= DB ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* ================= PARSING ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC ================= */
app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */
app.use("/api/admissions", admissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/fees", feesRoutes);

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server running 🚀",
  });
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found ❌",
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});