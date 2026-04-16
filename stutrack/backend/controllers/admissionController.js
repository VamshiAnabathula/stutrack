import Admission from "../models/AdmissionModel.js";

/* ================= GET ALL ================= */
export const getAdmissions = async (req, res) => {
  try {
    const students = await Admission.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getAdmissionById = async (req, res) => {
  try {
    const student = await Admission.findById(req.params.id);

    if (!student) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY EMAIL ================= */
export const getAdmissionByEmail = async (req, res) => {
  try {
    const student = await Admission.findOne({
      email: req.params.email,
    });

    if (!student) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CREATE ================= */
export const createAdmission = async (req, res) => {
  try {
    const data = req.body;

    const totalFees = Number(data.totalFees || 0);
    const paidFees = Number(data.paidFees || 0);

    let remainingFees = totalFees - paidFees;
    if (remainingFees < 0) remainingFees = 0;

    const student = new Admission({
      ...data,
      totalFees,
      paidFees,
      remainingFees,
    });

    await student.save();

    res.json({
      success: true,
      message: "Student admission created",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateAdmission = async (req, res) => {
  try {
    const data = req.body;

    const totalFees = Number(data.totalFees || 0);
    const paidFees = Number(data.paidFees || 0);

    let remainingFees = totalFees - paidFees;
    if (remainingFees < 0) remainingFees = 0;

    const updated = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        totalFees,
        paidFees,
        remainingFees,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Student updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE PHOTO ================= */
export const updateStudentPhoto = async (req, res) => {
  try {
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

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Photo updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("PHOTO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};