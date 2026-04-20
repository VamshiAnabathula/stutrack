import express from "express";
import mongoose from "mongoose";
import Fees from "../models/FeesModel.js";

const router = express.Router();

/* ================= CREATE FEES ================= */
router.post("/", async (req, res) => {
  try {
    const { studentId, totalFees, paidFees } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const total = Number(totalFees || 0);
    const paid = Number(paidFees || 0);

    if (paid > total) {
      return res.status(400).json({
        success: false,
        message: "Paid fees cannot be greater than total fees",
      });
    }

    const existingFees = await Fees.findOne({ studentId });

    if (existingFees) {
      return res.status(400).json({
        success: false,
        message: "Fees already exists for this student",
      });
    }

    const fees = await Fees.create({
      studentId,
      totalFees: total,
      paidFees: paid,
      remainingFees: total - paid,
    });

    return res.status(201).json({
      success: true,
      message: "Fees created successfully",
      fees,
    });
  } catch (err) {
    console.log("CREATE FEES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= GET FEES ================= */
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    let fees = await Fees.findOne({ studentId });

    if (!fees) {
      fees = await Fees.create({
        studentId,
        totalFees: 20000,
        paidFees: 0,
        remainingFees: 20000,
      });
    }

    return res.json({
      success: true,
      fees,
    });
  } catch (err) {
    console.log("GET FEES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= PAY FEES ================= */
router.put("/pay/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const amount = Number(req.body.amount);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const fees = await Fees.findOne({ studentId });

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees not found",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (fees.paidFees + amount > fees.totalFees) {
      return res.status(400).json({
        success: false,
        message: `Max allowed: ₹${fees.totalFees - fees.paidFees}`,
      });
    }

    fees.paidFees += amount;
    fees.remainingFees = fees.totalFees - fees.paidFees;

    await fees.save();

    return res.json({
      success: true,
      message: "Payment successful",
      fees,
    });
  } catch (err) {
    console.log("PAY FEES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;