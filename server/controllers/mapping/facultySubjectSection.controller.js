import FacultySubjectSection from "../../models/mapping/FacultySubjectSection.js";
import Faculty from "../../models/users/Faculty.js";

// @desc    Create Faculty-Subject-Section Assignment
// @route   POST /faculty-subject-section
// @access  Private (Admin)
export const createFacultySubjectSection = async (req, res, next) => {
  try {
    const { facultyId, subjectId, sectionId, academicYear, semester } = req.body;

    // Check if assignment already exists
    const exists = await FacultySubjectSection.findOne({
      facultyId,
      subjectId,
      sectionId,
      academicYear: academicYear || new Date().getFullYear(),
      semester,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Assignment already exists for this combination",
      });
    }

    const assignment = await FacultySubjectSection.create({
      facultyId,
      subjectId,
      sectionId,
      academicYear: academicYear || new Date().getFullYear(),
      semester,
    });

    const populated = await FacultySubjectSection.findById(assignment._id)
      .populate("facultyId", "employeeId")
      .populate("subjectId", "subjectName subjectCode")
      .populate("sectionId", "name");

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Faculty Assignments
// @route   GET /faculty/assignments
// @access  Private (Faculty, Admin)
export const getFacultyAssignments = async (req, res, next) => {
  try {
    const facultyId = req.profileId;

    const assignments = await FacultySubjectSection.find({
      facultyId,
      isActive: true,
    })
      .populate("subjectId", "subjectName subjectCode credits")
      .populate("sectionId", "name semester batchYear")
      .populate({
        path: "sectionId",
        populate: { path: "departmentId", select: "name code" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};
