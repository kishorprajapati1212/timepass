import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    designation: {
      type: String,
      default: "Assistant Professor",
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    specialization: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

facultySchema.index({ userId: 1 });
facultySchema.index({ employeeId: 1 });
facultySchema.index({ departmentId: 1 });

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;
