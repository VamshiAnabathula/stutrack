import express from "express";
import upload from "../middleware/upload.js";
import Admission from "../models/AdmissionModel.js";

const router = express.Router();

router.put("/:email", upload.single("photo"), async (req, res) => {
  try {
    console.log("HIT API"); // debug

    const { email } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const student = await Admission.findOneAndUpdate(
      { email },
      { photo: imageUrl },
      { new: true }
    );

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;