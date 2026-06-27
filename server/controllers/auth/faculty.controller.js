import bcrypt from "bcryptjs";
import User from "../../models/users/User.js";
import Faculty from "../../models/users/Faculty.js";
import generateToken from "../../utils/generateToken.js";

// @desc    Create Faculty (Admin only)
// @route   POST /faculty/create
// @access  Private (Admin)
export const createFaculty = async (req, res, next) => {
  try {
    const { name, email, password, employeeId, departmentId, designation, phone, specialization } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const facultyExists = await Faculty.findOne({ employeeId });
    if (facultyExists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "FACULTY",
    });

    const faculty = await Faculty.create({
      userId: user._id,
      employeeId,
      departmentId,
      designation: designation || "Assistant Professor",
      phone,
      specialization,
    });

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: faculty.employeeId,
        designation: faculty.designation,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Faculty Login
// @route   POST /faculty/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email, role: "FACULTY" }).select("+password");
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

    const faculty = await Faculty.findOne({ userId: user._id })
      .populate("departmentId", "name code");

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: faculty?.employeeId,
        department: faculty?.departmentId,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all faculty
// @route   GET /faculty
// @access  Private (Admin)
export const getAllFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.find()
      .populate("userId", "name email isActive")
      .populate("departmentId", "name code")
      .select("_id employeeId designation phone");

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current faculty profile
// @route   GET /faculty/me
// @access  Private (Faculty)
export const getFacultyProfile = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user._id })
      .populate("userId", "name email")
      .populate("departmentId", "name code");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};
