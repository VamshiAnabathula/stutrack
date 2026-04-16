import express from "express";
import mongoose from "mongoose";
import Fees from "../models/feesModel.js";

const router = express.Router();

/* ================= GET FEES BY STUDENT ID ================= */
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

    // auto create if not exists
    if (!fees) {
      fees = await Fees.create({
        studentId,
        totalFees: 0,
        paidFees: 0,
        remainingFees: 0,
      });
    }

    return res.status(200).json({
      success: true,
      fees,
    });

  } catch (err) {
    console.error("GET FEES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= CREATE OR UPDATE FEES ================= */
router.post("/", async (req, res) => {
  try {
    const { studentId, totalFees = 0, paidFees = 0 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const total = Number(totalFees);
    const paid = Number(paidFees);

    let remaining = total - paid;
    if (remaining < 0) remaining = 0;

    let fees = await Fees.findOne({ studentId });

    if (fees) {
      fees.totalFees = total;
      fees.paidFees = paid;
      fees.remainingFees = remaining;

      await fees.save();

      return res.status(200).json({
        success: true,
        message: "Fees updated successfully",
        fees,
      });
    }

    const newFees = await Fees.create({
      studentId,
      totalFees: total,
      paidFees: paid,
      remainingFees: remaining,
    });

    return res.status(201).json({
      success: true,
      message: "Fees created successfully",
      fees: newFees,
    });

  } catch (err) {
    console.error("POST FEES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= UPDATE FEES ================= */
router.put("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { totalFees = 0, paidFees = 0 } = req.body;

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
        message: "Fees record not found",
      });
    }

    const total = Number(totalFees);
    const paid = Number(paidFees);

    let remaining = total - paid;
    if (remaining < 0) remaining = 0;

    fees.totalFees = total;
    fees.paidFees = paid;
    fees.remainingFees = remaining;

    await fees.save();

    return res.status(200).json({
      success: true,
      message: "Fees updated successfully",
      fees,
    });

  } catch (err) {
    console.error("PUT FEES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;