import express from "express";
import Attendance from "../models/AttendanceModel.js";
import Admission from "../models/AdmissionModel.js";

const router = express.Router();

/* ================= CHECK IN ================= */
router.post("/checkin", async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Admission.findOne({ email });

    if (!student) {
      return res.json({ success: false, message: "Student not found" });
    }

    const newAttendance = new Attendance({
      email: student.email,
      fullName: student.fullName,
      course: student.course || "-",
      checkIn: new Date(),
      date: new Date(),
    });

    await newAttendance.save();

    res.json({
      success: true,
      message: "Check In Success",
      attendance: newAttendance,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});

/* ================= CHECK OUT ================= */
router.post("/checkout", async (req, res) => {
  try {
    const { email } = req.body;

    const lastAttendance = await Attendance.findOne({
      email,
      checkOut: null,
    }).sort({ checkIn: -1 });

    if (!lastAttendance) {
      return res.json({
        success: false,
        message: "Check In First",
      });
    }

    lastAttendance.checkOut = new Date();

    await lastAttendance.save();

    res.json({
      success: true,
      message: "Check Out Success",
      attendance: lastAttendance,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});

/* ================= ADMIN GET ALL ATTENDANCE ================= */
router.get("/all", async (req, res) => {
  try {

    const data = await Attendance.find().sort({ checkIn: -1 });

    const enrichedData = await Promise.all(
      data.map(async (a) => {

        const student = await Admission.findOne({ email: a.email });

        return {
          _id: a._id,
          fullName: a.fullName,
          email: a.email,
          course: student?.course || "-",
          date: a.date,
          checkIn: a.checkIn,
          checkOut: a.checkOut,
        };

      })
    );

    res.json(enrichedData);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching attendance",
    });

  }
});

/* ================= STUDENT ATTENDANCE ================= */
router.get("/student/:email", async (req, res) => {

  try {

    const { email } = req.params;

    const attendance = await Attendance.find({ email }).sort({ checkIn: -1 });

    res.json(attendance);

  } catch (error) {

    res.status(500).json({ message: "Error fetching attendance" });

  }

});

export default router;