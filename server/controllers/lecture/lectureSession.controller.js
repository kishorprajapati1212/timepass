import LectureSession from "../../models/lecture/LectureSession.js";
import FacultySubjectSection from "../../models/mapping/FacultySubjectSection.js";
import { generateQRData } from "../../utils/generateQR.js";
import dayjs from "dayjs";

export const startLectureSession = async (req, res, next) => {
  try {
    const { subjectId, sectionId, topic, description, location, attendanceWindow } = req.body;
    const facultyId = req.profileId;

    const assignment = await FacultySubjectSection.findOne({
      facultyId,
      subjectId,
      sectionId,
      isActive: true,
    });

    if (!assignment && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this subject-section",
      });
    }

    const existingActive = await LectureSession.findOne({
      facultyId,
      status: "ACTIVE",
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: "You already have an active lecture. End it first.",
        data: { activeLectureId: existingActive._id },
      });
    }

    // Create lecture FIRST
    const lecture = await LectureSession.create({
      facultyId,
      subjectId,
      sectionId,
      topic,
      description,
      status: "ACTIVE",
      startTime: new Date(),
      qrCode: "placeholder",
      qrExpiresAt: dayjs().add(5, "minute").toDate(),
      location: location || {},
      attendanceWindow: attendanceWindow || 15,
    });

    // Generate QR with actual lecture ID
    const qrCode = generateQRData(lecture._id);
    lecture.qrCode = qrCode;
    await lecture.save();

    res.status(201).json({
      success: true,
      message: "Lecture session started successfully",
      data: {
        lectureSessionId: lecture._id,
        qrCode: lecture.qrCode,
        qrExpiresAt: lecture.qrExpiresAt,
        topic: lecture.topic,
        startTime: lecture.startTime,
        status: lecture.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const endLectureSession = async (req, res, next) => {
  try {
    const { lectureSessionId } = req.body;
    const facultyId = req.profileId;

    const lecture = await LectureSession.findOne({
      _id: lectureSessionId,
      facultyId,
      status: "ACTIVE",
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Active lecture session not found",
      });
    }

    lecture.status = "COMPLETED";
    lecture.endTime = new Date();
    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture session ended successfully",
      data: {
        lectureSessionId: lecture._id,
        duration: dayjs(lecture.endTime).diff(dayjs(lecture.startTime), "minute"),
        totalMarked: lecture.totalMarked,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLiveQr = async (req, res, next) => {
  try {
    const { lectureSessionId } = req.params;
    const facultyId = req.profileId;

    const lecture = await LectureSession.findOne({
      _id: lectureSessionId,
      facultyId,
      status: "ACTIVE",
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Active lecture session not found",
      });
    }

    if (dayjs().isAfter(dayjs(lecture.qrExpiresAt))) {
      lecture.qrCode = generateQRData(lecture._id);
      lecture.qrExpiresAt = dayjs().add(5, "minute").toDate();
      await lecture.save();
    }

    res.status(200).json({
      success: true,
      data: {
        lectureSessionId: lecture._id,
        qrCode: lecture.qrCode,
        qrExpiresAt: lecture.qrExpiresAt,
        timeRemaining: dayjs(lecture.qrExpiresAt).diff(dayjs(), "seconds"),
      },
    });
  } catch (error) {
    next(error);
  }
};