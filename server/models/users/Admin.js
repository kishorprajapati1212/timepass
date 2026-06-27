import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

adminSchema.index({ userId: 1 });
adminSchema.index({ employeeId: 1 });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
