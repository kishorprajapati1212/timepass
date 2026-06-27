import Subject from "../../models/Academics/Subject.js";

// @desc    Create Subject
// @route   POST /subject/create
// @access  Private (Admin)
export const createSubject = async (req, res, next) => {
  try {
    const { subjectName, subjectCode, departmentId, credits, semester } = req.body;

    const subjectExists = await Subject.findOne({
      $or: [{ subjectCode: subjectCode.toUpperCase() }],
    });

    if (subjectExists) {
      return res.status(400).json({
        success: false,
        message: "Subject with this code already exists",
      });
    }

    const subject = await Subject.create({
      subjectName,
      subjectCode: subjectCode.toUpperCase(),
      departmentId,
      credits: credits || 3,
      semester: semester || 1,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subjects
// @route   GET /subjects
// @access  Public
export const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isActive: true })
      .populate("departmentId", "name code")
      .select("_id subjectName subjectCode credits semester")
      .sort({ subjectName: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};
