import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      default: null,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    enrollmentYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    semester: {
      type: Number,
      default: 1,
      min: 1,
      max: 8,
    },
    phone: {
      type: String,
      default: null,
    },
    parentPhone: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

studentSchema.index({ userId: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ sectionId: 1 });
studentSchema.index({ departmentId: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
