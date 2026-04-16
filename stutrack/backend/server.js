import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// ROUTES
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

/* ================= CONNECT DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static("uploads"));

/* ================= API ROUTES ================= */
app.use("/api/admissions", admissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/fees", feesRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Stutrack API running...",
  });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found ❌",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});