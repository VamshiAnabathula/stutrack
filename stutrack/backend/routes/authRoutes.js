import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Admission from "../models/AdmissionModel.js";

dotenv.config();

const router = express.Router();

/* ================= EMAIL SETUP ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= DEBUG ================= */
console.log("✅ Auth Routes Loaded");

/* =========================================================
   ✅ 1. EMAIL LOGIN → SEND OTP
========================================================= */
router.post("/send-otp", async (req, res) => {
  console.log("➡️ /send-otp HIT");

  try {
    const { email } = req.body;

    const student = await Admission.findOne({
      email: email.trim(),
    });

    if (!student) {
      return res.json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    student.otp = otp;
    student.otpExpiry = Date.now() + 5 * 60 * 1000;

    await student.save();

   await transporter.sendMail({
  from: `"StuTrack" <${process.env.EMAIL_USER}>`, // ✅ FIX
  to: email,
  subject: "Login OTP",
  html: `<h2>Your OTP: ${otp}</h2>`,
});

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ✅ 2. FORGOT EMAIL → MOBILE → OTP
========================================================= */
router.post("/mobile-send-otp", async (req, res) => {
  console.log("➡️ /mobile-send-otp HIT");

  try {
    const { mobile } = req.body;

    // 🔥 CLEAN MOBILE (MAIN FIX)
    const cleanMobile = String(mobile).trim();

    console.log("INPUT:", mobile);
    console.log("CLEAN:", cleanMobile);

    const student = await Admission.findOne({
      mobile: cleanMobile,
    });

    console.log("FOUND STUDENT:", student);

    if (!student) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    student.otp = otp;
    student.otpExpiry = Date.now() + 5 * 60 * 1000;

    await student.save();

   await transporter.sendMail({
  from: `"StuTrack" <${process.env.EMAIL_USER}>`, // ✅ FIX
  to: student.email,
  subject: "OTP for Login",
  html: `
    <h2>Your OTP: ${otp}</h2>
    <p>Email: <b>${student.email}</b></p>
  `,
});

    res.json({
      success: true,
      email: student.email,
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ✅ 3. VERIFY OTP
========================================================= */
router.post("/verify-otp", async (req, res) => {
  console.log("➡️ /verify-otp HIT");

  try {
    const { email, otp } = req.body;

    const student = await Admission.findOne({
      email: email.trim(),
    });

    if (!student) {
      return res.json({ success: false, message: "User not found" });
    }

    if (student.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (student.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    // CLEAR OTP
    student.otp = null;
    student.otpExpiry = null;
    await student.save();

    // TOKEN
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      student,
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

export default router;