// backend/routes/leaveRoutes.js
import express from "express";
import Leave from "../models/LeaveModel.js";
import Admission from "../models/AdmissionModel.js";
import Notification from "../models/NotificationModel.js"; // ✅ Import Notification model

const router = express.Router();

/* ================= APPLY LEAVE ================= */
router.post("/apply", async (req, res) => {
  try {
    const { email, fromDate, toDate, reason } = req.body;

    if (!email || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const student = await Admission.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: "Student not found with this email",
      });
    }

    const leave = new Leave({
      fullName: student.fullName,
      email: student.email,
      fromDate,
      toDate,
      reason,
      status: "Pending",
    });

    const savedLeave = await leave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= GET ALL LEAVES ================= */
router.get("/all", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= GET LEAVES BY STUDENT EMAIL ================= */
router.get("/student/:email", async (req, res) => {
  try {
    const leaves = await Leave.find({ email: req.params.email }).sort({ updatedAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE LEAVE ================= */
router.put("/update/:id", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status === "Approved") {
      return res.status(400).json({ message: "Approved leave cannot be edited" });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= DELETE LEAVE ================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status === "Approved") {
      return res.status(400).json({ message: "Approved leave cannot be deleted" });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= APPROVE LEAVE ================= */
router.put("/approve/:id", async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // ✅ Create notification for student
    await Notification.create({
      email: leave.email,
      title: "Leave Approved",
      message: `Your leave from ${leave.fromDate} to ${leave.toDate} has been approved.`,
      type: "leave",
    });

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= REJECT LEAVE ================= */
router.put("/reject/:id", async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // ✅ Create notification for student
    await Notification.create({
      email: leave.email,
      title: "Leave Rejected",
      message: `Your leave from ${leave.fromDate} to ${leave.toDate} has been rejected.`,
      type: "leave",
    });

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;