import express from "express";
import Course from "../models/CourseModel.js";

const router = express.Router();

/* ================= ADD COURSE ================= */

router.post("/add", async (req, res) => {

  const { courseName, duration, fees } = req.body;

  const normalized = courseName.toLowerCase().replace(/\s+/g, " ").trim();

  const existing = await Course.findOne({
    courseName: { $regex: `^${normalized}$`, $options: "i" }
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Course already exists"
    });
  }

  const course = new Course({
    courseName,
    duration,
    fees
  });

  await course.save();

  res.json({
    success: true,
    message: "Course added"
  });

});

/* ================= GET COURSES ================= */

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Fetch Course Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
});

export default router;