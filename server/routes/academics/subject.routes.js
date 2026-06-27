import express from "express";
import {
  createSubject,
  getAllSubjects,
} from "../../controllers/academics/subject.controller.js";
import protect from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/subject/create", protect, authorizeRoles("ADMIN"), createSubject);
router.get("/subjects", getAllSubjects);

export default router;
