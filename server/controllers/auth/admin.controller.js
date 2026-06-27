import bcrypt from "bcryptjs";
import User from "../../models/users/User.js";
import Admin from "../../models/users/Admin.js";
import generateToken from "../../utils/generateToken.js";

// @desc    Create Admin (Initial Setup)
// @route   POST /admin/create
// @access  Public (should be protected in production)
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, employeeId, phone } = req.body;

    // Check if admin already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const adminExists = await Admin.findOne({ employeeId });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    });

    // Create admin profile
    const admin = await Admin.create({
      userId: user._id,
      employeeId,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: admin.employeeId,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Login
// @route   POST /admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email, role: "ADMIN" }).select("+password");
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

    const admin = await Admin.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: admin?.employeeId,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};
