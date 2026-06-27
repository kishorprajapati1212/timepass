import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    lectureSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LectureSession",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "EXCUSED"],
      default: "ABSENT",
    },
    markedAt: {
      type: Date,
      default: null,
    },
    markMethod: {
      type: String,
      enum: ["QR", "MANUAL", "BIOMETRIC", "AUTO"],
      default: "QR",
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = self-marked via QR
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    deviceInfo: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance
attendanceSchema.index({ lectureSessionId: 1, studentId: 1 }, { unique: true });
attendanceSchema.index({ studentId: 1, createdAt: -1 });
attendanceSchema.index({ lectureSessionId: 1, status: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
