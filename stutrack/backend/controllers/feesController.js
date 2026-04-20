import Fees from "../models/FeesModel.js";
import Admission from "../models/AdmissionModel.js";
import mongoose from "mongoose";

/* ================= GET FEES ================= */
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

    // auto create
    if (!fees) {
      fees = await Fees.create({
        studentId,
        totalFees: 20000,
        paidFees: 0,
        remainingFees: 20000,
      });
    }

    res.json({ success: true, fees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

/* ================= PAY FEES (SYNC FIXED) ================= */
export const payFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { amount } = req.body;

    let fees = await Fees.findOne({ studentId });

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees not found",
      });
    }

    const payAmount = Number(amount);

    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (fees.paidFees + payAmount > fees.totalFees) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds total fees",
      });
    }

    /* ================= UPDATE FEES ================= */
    fees.paidFees += payAmount;
    fees.remainingFees = fees.totalFees - fees.paidFees;

    await fees.save();

    /* ================= SYNC WITH ADMISSION ================= */
    await Admission.findByIdAndUpdate(
      studentId,
      {
        paidFees: fees.paidFees,
        remainingFees: fees.remainingFees,
        totalFees: fees.totalFees,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment successful & synced with Admission",
      fees,
    });

  } catch (error) {
    console.log("PAY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};