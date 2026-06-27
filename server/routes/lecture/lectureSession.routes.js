import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import getProfileId from "../../middleware/identity.middleware.js";
import {
  startLectureSession,
  endLectureSession,
  getLiveQr,
} from "../../controllers/lecture/lectureSession.controller.js";

const router = express.Router();

router.post(
  "/lecture/start",
  protect,
  getProfileId,
  authorizeRoles("FACULTY", "ADMIN"),
  startLectureSession
);
router.post(
  "/lecture/end",
  protect,
  getProfileId,
  authorizeRoles("FACULTY", "ADMIN"),
  endLectureSession
);
router.get(
  "/lecture/live-qr/:lectureSessionId",
  protect,
  getProfileId,
  authorizeRoles("FACULTY", "ADMIN"),
  getLiveQr
);

export default router;
