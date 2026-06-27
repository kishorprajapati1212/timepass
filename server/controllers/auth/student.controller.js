import bcrypt from "bcryptjs";
import User from "../../models/users/User.js";
import Student from "../../models/users/Student.js";
import generateToken from "../../utils/generateToken.js";

// @desc    Create Student (Admin only)
// @route   POST /student/create
// @access  Private (Admin)
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, sectionId, departmentId, enrollmentYear, semester, phone, parentPhone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const studentExists = await Student.findOne({ rollNumber });
    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
    });

    const student = await Student.create({
      userId: user._id,
      rollNumber: rollNumber.toUpperCase(),
      sectionId,
      departmentId,
      enrollmentYear: enrollmentYear || new Date().getFullYear(),
      semester: semester || 1,
      phone,
      parentPhone,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: student.rollNumber,
        semester: student.semester,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student Login
// @route   POST /student/login
// @access  Public
export const studentLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email, role: "STUDENT" }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const student = await Student.findOne({ userId: user._id })
      .populate("sectionId", "name")
      .populate("departmentId", "name code");

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: student?.rollNumber,
        section: student?.sectionId,
        department: student?.departmentId,
        semester: student?.semester,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /students
// @access  Private (Admin, Faculty)
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email isActive")
      .populate("sectionId", "name")
      .populate("departmentId", "name code")
      .select("_id rollNumber semester enrollmentYear phone");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};
