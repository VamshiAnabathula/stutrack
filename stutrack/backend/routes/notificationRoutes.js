// backend/routes/notificationRoutes.js
import express from "express";
import Notification from "../models/NotificationModel.js";
import Leave from "../models/LeaveModel.js";
import Admission from "../models/AdmissionModel.js"; // To fetch all students

const router = express.Router();

/* ================= SEND SINGLE NOTIFICATION ================= */
router.post("/send", async (req, res) => {
  try {
    const { email, title, message, type = "general" } = req.body;

    if (!email || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, title, and message",
      });
    }

    const notification = new Notification({
      title,
      message,
      type,
      emails: [email],
      seenBy: [], // Track which users have seen this notification
      createdAt: new Date(),
    });

    await notification.save();

    res.json({ success: true, message: "Notification sent successfully" });
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= SEND BROADCAST NOTIFICATION ================= */
router.post("/broadcast", async (req, res) => {
  try {
    const { title, message, type = "general" } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and message for broadcast",
      });
    }

    const students = await Admission.find({}, { email: 1, _id: 0 });
    const emails = students.map((s) => s.email);

    if (emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No students found to send notifications",
      });
    }

    const notification = new Notification({
      title,
      message,
      type,
      emails,
      seenBy: [],
      createdAt: new Date(),
    });

    await notification.save();

    res.json({
      success: true,
      message: `Broadcast notification sent to ${emails.length} students`,
      emailsSent: emails.length,
    });
  } catch (error) {
    console.error("❌ Error sending broadcast notification:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= GET ALL NOTIFICATIONS ================= */
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      notifications: [],
    });
  }
});

/* ================= GET NOTIFICATIONS FOR A STUDENT ================= */
router.get("/student/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const notifications = await Notification.find({ emails: email }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching student notifications:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      notifications: [],
    });
  }
});

/* ================= MARK NOTIFICATIONS AS SEEN ================= */
router.post("/mark-seen/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Mark all notifications for this email as seen
    await Notification.updateMany(
      { emails: email, seenBy: { $ne: email } }, // only unseen for this student
      { $push: { seenBy: email } }
    );

    // Mark all leaves as seen
    await Leave.updateMany(
      { email: email, status: { $in: ["Approved", "Rejected"] }, seenByStudent: false },
      { seenByStudent: true }
    );

    res.json({ success: true, message: "All notifications & leaves marked as seen" });
  } catch (err) {
    console.error("❌ Error marking seen:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= GET UNSEEN NOTIFICATIONS FOR BELL DOT ================= */
router.get("/unseen/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Unseen admin/general notifications
    const unseenNotifications = await Notification.find({
      emails: email,
      seenBy: { $ne: email },
    });

    // New leaves not seen by student
    const newLeaves = await Leave.find({
      email: email,
      status: { $in: ["Approved", "Rejected"] },
      seenByStudent: false,
    });

    res.json({
      hasUnseen: unseenNotifications.length > 0 || newLeaves.length > 0,
    });
  } catch (err) {
    console.error("❌ Error fetching unseen:", err.message);
    res.status(500).json({ hasUnseen: false });
  }
});

export default router;