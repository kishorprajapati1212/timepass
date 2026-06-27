import express from "express";
import { createAdmin, loginAdmin } from "../../controllers/auth/admin.controller.js";
import protect from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/admin/create", createAdmin);
router.post("/admin/login", loginAdmin);

export default router;
