import Fees from "../models/FeesModel.js";
import mongoose from "mongoose";

/* ================= CREATE OR UPDATE FEES ================= */
export const createOrUpdateFees = async (req, res) => {
  try {
    const { studentId, totalFees, paidFees } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    let fees = await Fees.findOne({ studentId });

    const total = Number(totalFees || 0);
    const paid = Number(paidFees || 0);

    let remaining = total - paid;
    if (remaining < 0) remaining = 0;

    // If exists → update
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

    // If not exists → create
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET FEES BY STUDENT ID ================= */
export const getFeesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    let fees = await Fees.findOne({ studentId });

    // Auto create if not exists (safe fallback)
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE FEES ================= */
export const deleteFeesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    await Fees.findOneAndDelete({ studentId });

    return res.status(200).json({
      success: true,
      message: "Fees deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};