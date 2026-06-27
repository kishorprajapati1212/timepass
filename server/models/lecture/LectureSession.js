import mongoose from "mongoose";

const lectureSessionSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    topic: {
      type: String,
      required: [true, "Lecture topic is required"],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    qrCode: {
      type: String,
      default: null,
    },
    qrExpiresAt: {
      type: Date,
      default: null,
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      radius: { type: Number, default: 100 }, // meters
    },
    attendanceWindow: {
      type: Number,
      default: 15, // minutes after lecture starts
    },
    totalMarked: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

lectureSessionSchema.index({ facultyId: 1, status: 1 });
lectureSessionSchema.index({ sectionId: 1 });
lectureSessionSchema.index({ subjectId: 1 });
lectureSessionSchema.index({ status: 1 });
lectureSessionSchema.index({ startTime: -1 });

const LectureSession = mongoose.model("LectureSession", lectureSessionSchema);
export default LectureSession;
