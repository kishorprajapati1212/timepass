import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
} from "../../controllers/academics/department.controller.js";
import protect from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/department/create", protect, authorizeRoles("ADMIN"), createDepartment);
router.get("/departments", protect, authorizeRoles("ADMIN"), getAllDepartments);
router.get("/department/:id", protect, authorizeRoles("ADMIN"), getDepartmentById);

export default router;
