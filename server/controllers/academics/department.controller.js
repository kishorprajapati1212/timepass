import Department from "../../models/Academics/Department.js";

// @desc    Create Department
// @route   POST /department/create
// @access  Private (Admin)
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description } = req.body;

    const deptExists = await Department.findOne({
      $or: [{ name }, { code: code.toUpperCase() }],
    });

    if (deptExists) {
      return res.status(400).json({
        success: false,
        message: "Department with this name or code already exists",
      });
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments
// @route   GET /departments
// @access  Private (Admin)
export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department
// @route   GET /department/:id
// @access  Private (Admin)
export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
