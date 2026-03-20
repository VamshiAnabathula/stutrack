// ================= LOAD ENV =================
import dotenv from "dotenv";
dotenv.config();

// ================= IMPORT PACKAGES =================
import express from "express";
import cors from "cors";

// ================= IMPORT DB =================
import connectDB from "./config/db.js";

// ================= IMPORT ROUTES =================
import admissionRoutes from "./routes/admissionRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

// ================= INITIALIZE APP =================
const app = express();

// ================= PORT =================
const PORT = process.env.PORT || 5000;

// ================= CONNECT DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES =================
app.use("/api/admissions", admissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/courses", courseRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Stutrack API is running...",
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found ❌",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack || err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ================= ENV CHECK =================
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER || "Not Found ❌");
console.log(
  "🔐 EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded ✅" : "Not Loaded ❌"
);

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});