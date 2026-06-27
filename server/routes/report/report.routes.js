import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import getProfileId from "../../middleware/identity.middleware.js";
import {
  downloadAttendanceExcel,
  exportAndUploadExcel,
  getStudentAttendanceReport,
  getLectureAttendanceSummary,
  getFacultyDashboardStats,
  getSavedReports,
} from "../../controllers/report/report.controller.js";

const router = express.Router();

// Student views own attendance
router.get(
  "/api/report/student/my-attendance",
  protect,
  getProfileId,
  authorizeRoles("STUDENT"),
  getStudentAttendanceReport
);

// Faculty/Admin views lecture summary
router.get(
  "/api/report/lecture/:lectureSessionId/summary",
  protect,
  authorizeRoles("FACULTY", "ADMIN"),
  getLectureAttendanceSummary
);

// Faculty dashboard
router.get(
  "/api/report/faculty/dashboard",
  protect,
  getProfileId,
  authorizeRoles("FACULTY"),
  getFacultyDashboardStats
);

// Download Excel directly (Render-friendly)
router.get(
  "/api/report/lecture/:lectureSessionId/download",
  protect,
  authorizeRoles("FACULTY", "ADMIN"),
  downloadAttendanceExcel
);

// Upload to Cloudinary
router.post(
  "/api/report/lecture/:lectureSessionId/upload",
  protect,
  authorizeRoles("FACULTY", "ADMIN"),
  exportAndUploadExcel
);

// Get saved reports
router.get(
  "/api/report/saved-reports",
  protect,
  authorizeRoles("FACULTY", "ADMIN"),
  getSavedReports
);

export default router;
