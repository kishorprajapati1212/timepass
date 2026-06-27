import Attendance from "../../models/Attendance/Attendance.js";
import LectureSession from "../../models/lecture/LectureSession.js";
import Student from "../../models/users/Student.js";
import { verifyQRData } from "../../utils/generateQR.js";
import dayjs from "dayjs";

// @desc    Mark Attendance (Student scans QR)
// @route   POST /student/mark
// @access  Private (Student)
export const markAttendance = async (req, res, next) => {
  try {
    const { qrData, location } = req.body;
    const studentId = req.profileId;

    // Verify QR
    const qrVerification = verifyQRData(qrData);
    if (!qrVerification.valid) {
      return res.status(400).json({
        success: false,
        message: qrVerification.message,
      });
    }

    const { lectureSessionId } = qrVerification.data;

    // Check lecture exists and is active
    const lecture = await LectureSession.findById(lectureSessionId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture session not found",
      });
    }

    if (lecture.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: `Lecture is ${lecture.status.toLowerCase()}`,
      });
    }

    // Check attendance window
    const lectureStart = dayjs(lecture.startTime);
    const now = dayjs();
    const minutesSinceStart = now.diff(lectureStart, "minute");

    if (minutesSinceStart > lecture.attendanceWindow) {
      return res.status(400).json({
        success: false,
        message: `Attendance window closed. Lecture started ${minutesSinceStart} minutes ago.`,
      });
    }

    // Check if already marked
    const existingAttendance = await Attendance.findOne({
      lectureSessionId,
      studentId,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this lecture",
        data: {
          status: existingAttendance.status,
          markedAt: existingAttendance.markedAt,
        },
      });
    }

    // Verify student belongs to lecture section
    const student = await Student.findById(studentId);
    if (student.sectionId?.toString() !== lecture.sectionId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this section",
      });
    }

    // Mark attendance
    const attendance = await Attendance.create({
      lectureSessionId,
      studentId,
      status: "PRESENT",
      markedAt: new Date(),
      markMethod: "QR",
      location: location || {},
    });

    // Update lecture total
    await LectureSession.findByIdAndUpdate(lectureSessionId, {
      $inc: { totalMarked: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: {
        attendanceId: attendance._id,
        status: attendance.status,
        markedAt: attendance.markedAt,
        lectureTopic: lecture.topic,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Lecture Attendance Status (Faculty/Admin view)
// @route   GET /lecture/:lectureSessionId
// @access  Private (Faculty, Admin)
export const getLectureAttendanceStatus = async (req, res, next) => {
  try {
    const { lectureSessionId } = req.params;

    const lecture = await LectureSession.findById(lectureSessionId)
      .populate("subjectId", "subjectName subjectCode")
      .populate("sectionId", "name")
      .populate("facultyId", "employeeId");

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture session not found",
      });
    }

    const attendances = await Attendance.find({ lectureSessionId })
      .populate("studentId", "rollNumber name email")
      .sort({ markedAt: -1 });

    const present = attendances.filter((a) => a.status === "PRESENT").length;
    const absent = attendances.filter((a) => a.status === "ABSENT").length;
    const late = attendances.filter((a) => a.status === "LATE").length;

    res.status(200).json({
      success: true,
      data: {
        lecture: {
          id: lecture._id,
          topic: lecture.topic,
          subject: lecture.subjectId,
          section: lecture.sectionId,
          status: lecture.status,
          startTime: lecture.startTime,
          endTime: lecture.endTime,
        },
        summary: {
          totalStudents: attendances.length,
          present,
          absent,
          late,
          attendanceRate:
            attendances.length > 0
              ? parseFloat(((present / attendances.length) * 100).toFixed(2))
              : 0,
        },
        attendances: attendances.map((a) => ({
          id: a._id,
          student: a.studentId,
          status: a.status,
          markedAt: a.markedAt,
          markMethod: a.markMethod,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
