import ExcelJS from "exceljs";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Attendance from "../../models/Attendance/Attendance.js";
import LectureSession from "../../models/lecture/LectureSession.js";
import Student from "../../models/users/Student.js";
import Report from "../../models/Report/Report.js";
import generateExcelBuffer from "../../utils/excelGenerator.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Download Attendance Excel (Direct Download - Best for Render)
// @route   GET /api/report/lecture/:lectureSessionId/download
// @access  Private (Faculty, Admin)
export const downloadAttendanceExcel = async (req, res, next) => {
  try {
    const { lectureSessionId } = req.params;

    const buffer = await generateExcelBuffer(lectureSessionId);

    const lecture = await LectureSession.findById(lectureSessionId).populate(
      "subjectId",
      "subjectName"
    );

    const fileName = `attendance_${lecture?.subjectId?.subjectName || lectureSessionId}_${Date.now()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", buffer.length);

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Excel to Cloudinary (Persistent Storage)
// @route   POST /api/report/lecture/:lectureSessionId/upload
// @access  Private (Faculty, Admin)
export const exportAndUploadExcel = async (req, res, next) => {
  try {
    const { lectureSessionId } = req.params;
    const buffer = await generateExcelBuffer(lectureSessionId);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "attendance_reports",
          public_id: `attendance_${lectureSessionId}_${Date.now()}`,
          format: "xlsx",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Save report record
    const lecture = await LectureSession.findById(lectureSessionId);
    const attendances = await Attendance.find({ lectureSessionId });
    const present = attendances.filter((a) => a.status === "PRESENT").length;

    await Report.create({
      lectureSessionId,
      generatedBy: req.user._id,
      reportType: "LECTURE",
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: uploadResult.original_filename,
      fileSize: uploadResult.bytes,
      summary: {
        totalStudents: attendances.length,
        present,
        absent: attendances.length - present,
        attendanceRate:
          attendances.length > 0
            ? parseFloat(((present / attendances.length) * 100).toFixed(2))
            : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Excel uploaded successfully",
      data: {
        downloadUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student views own attendance report
// @route   GET /api/report/student/my-attendance
// @access  Private (Student)
export const getStudentAttendanceReport = async (req, res, next) => {
  try {
    const studentId = req.profileId;

    const attendances = await Attendance.find({ studentId })
      .populate({
        path: "lectureSessionId",
        select: "topic startTime endTime subjectId",
        populate: { path: "subjectId", select: "subjectName subjectCode" },
      })
      .sort({ createdAt: -1 });

    const totalLectures = attendances.length;
    const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
    const absentCount = totalLectures - presentCount;
    const percentage =
      totalLectures > 0
        ? parseFloat(((presentCount / totalLectures) * 100).toFixed(2))
        : 0;

    // Subject-wise stats
    const subjectStats = {};
    attendances.forEach((att) => {
      const subj = att.lectureSessionId?.subjectId?.subjectName || "Unknown";
      if (!subjectStats[subj])
        subjectStats[subj] = { subject: subj, total: 0, present: 0 };
      subjectStats[subj].total++;
      if (att.status === "PRESENT") subjectStats[subj].present++;
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalLectures,
          present: presentCount,
          absent: absentCount,
          percentage,
        },
        subjectBreakdown: Object.values(subjectStats),
        details: attendances.map((att) => ({
          lectureId: att.lectureSessionId?._id,
          subjectName: att.lectureSessionId?.subjectId?.subjectName,
          subjectCode: att.lectureSessionId?.subjectId?.subjectCode,
          topic: att.lectureSessionId?.topic,
          date: att.lectureSessionId?.startTime,
          status: att.status,
          markedAt: att.markedAt,
          method: att.markMethod || "QR",
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Lecture Attendance Summary
// @route   GET /api/report/lecture/:lectureSessionId/summary
// @access  Private (Faculty, Admin)
export const getLectureAttendanceSummary = async (req, res, next) => {
  try {
    const { lectureSessionId } = req.params;

    const [attendances, lecture] = await Promise.all([
      Attendance.find({ lectureSessionId }).populate(
        "studentId",
        "rollNumber name email"
      ),
      LectureSession.findById(lectureSessionId)
        .populate("subjectId", "subjectName subjectCode")
        .populate("sectionId", "name")
        .populate("facultyId", "employeeId"),
    ]);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const present = attendances.filter((a) => a.status === "PRESENT").length;
    const absent = attendances.filter((a) => a.status === "ABSENT").length;
    const total = present + absent;

    res.status(200).json({
      success: true,
      data: {
        lectureInfo: {
          id: lectureSessionId,
          subject: lecture.subjectId?.subjectName,
          subjectCode: lecture.subjectId?.subjectCode,
          section: lecture.sectionId?.name,
          topic: lecture.topic,
          date: lecture.startTime,
          status: lecture.status,
          startTime: lecture.startTime,
          endTime: lecture.endTime,
        },
        summary: {
          totalStudents: total,
          present,
          absent,
          attendanceRate:
            total > 0 ? parseFloat(((present / total) * 100).toFixed(2)) : 0,
        },
        students: attendances.map((a) => ({
          id: a.studentId?._id,
          rollNumber: a.studentId?.rollNumber,
          name: a.studentId?.name,
          email: a.studentId?.email,
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

// @desc    Faculty Dashboard Stats
// @route   GET /api/report/faculty/dashboard
// @access  Private (Faculty)
export const getFacultyDashboardStats = async (req, res, next) => {
  try {
    const facultyId = req.profileId;

    const lectures = await LectureSession.find({ facultyId })
      .populate("subjectId", "subjectName")
      .populate("sectionId", "name")
      .sort({ createdAt: -1 });

    const totalLectures = lectures.length;
    const activeLectures = lectures.filter((l) => l.status === "ACTIVE").length;
    const completedLectures = totalLectures - activeLectures;

    // Get recent 5 lectures with attendance count
    const recentLectures = await Promise.all(
      lectures.slice(0, 5).map(async (lec) => {
        const count = await Attendance.countDocuments({
          lectureSessionId: lec._id,
          status: "PRESENT",
        });
        return {
          id: lec._id,
          subject: lec.subjectId?.subjectName,
          section: lec.sectionId?.name,
          topic: lec.topic,
          date: lec.startTime,
          status: lec.status,
          presentCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalLectures,
          activeLectures,
          completedLectures,
        },
        recentLectures,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Saved Reports from Cloudinary
// @route   GET /api/report/saved-reports
// @access  Private (Faculty, Admin)
export const getSavedReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("lectureSessionId", "topic startTime")
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
