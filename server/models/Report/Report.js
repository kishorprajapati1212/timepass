import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    lectureSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LectureSession",
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["LECTURE", "MONTHLY", "SEMESTER", "SUBJECT_WISE", "STUDENT_WISE"],
      default: "LECTURE",
    },
    cloudinaryUrl: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    summary: {
      totalStudents: { type: Number, default: 0 },
      present: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      attendanceRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

reportSchema.index({ lectureSessionId: 1 });
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);
export default Report;
