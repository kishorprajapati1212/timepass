import Section from "../../models/Academics/Section.js";

// @desc    Create Section
// @route   POST /section/create
// @access  Private (Admin)
export const createSection = async (req, res, next) => {
  try {
    const { name, departmentId, semester, batchYear } = req.body;

    const sectionExists = await Section.findOne({
      name,
      departmentId,
      semester,
      batchYear,
    });

    if (sectionExists) {
      return res.status(400).json({
        success: false,
        message: "Section already exists for this department, semester and batch",
      });
    }

    const section = await Section.create({
      name,
      departmentId,
      semester,
      batchYear,
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sections
// @route   GET /sections
// @access  Private (Admin)
export const getAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find({ isActive: true })
      .populate("departmentId", "name code")
      .sort({ batchYear: -1, semester: 1 });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections,
    });
  } catch (error) {
    next(error);
  }
};
