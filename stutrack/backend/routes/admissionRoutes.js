import express from "express";
import {
  getAdmissions,
  getAdmissionById,
  getAdmissionByEmail,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admissionController.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", getAdmissions);

/* ================= GET BY EMAIL ================= */
router.get("/email/:email", getAdmissionByEmail);

/* ================= GET BY ID ================= */
router.get("/:id", getAdmissionById);

/* ================= CREATE ================= */
router.post("/", createAdmission);

/* ================= UPDATE ================= */
router.put("/:id", updateAdmission);

/* ================= DELETE ================= */
router.delete("/:id", deleteAdmission);

export default router;