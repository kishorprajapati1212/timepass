import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    credits: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },
    semester: {
      type: Number,
      default: 1,
      min: 1,
      max: 8,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

subjectSchema.index({ subjectCode: 1 });
subjectSchema.index({ departmentId: 1 });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
