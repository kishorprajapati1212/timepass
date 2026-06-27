import express from "express";
import {
  createStudent,
  studentLogin,
  getAllStudents,
} from "../../controllers/auth/student.controller.js";
import protect from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/student/create", protect, authorizeRoles("ADMIN"), createStudent);
router.post("/student/login", studentLogin);
router.get("/students", protect, authorizeRoles("ADMIN", "FACULTY"), getAllStudents);

export default router;
