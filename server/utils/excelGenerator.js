import ExcelJS from "exceljs";
import Attendance from "../models/Attendance/Attendance.js";
import LectureSession from "../models/lecture/LectureSession.js";

const generateExcelBuffer = async (lectureSessionId) => {
  const attendances = await Attendance.find({ lectureSessionId })
    .populate("studentId", "rollNumber name email")
    .populate("lectureSessionId", "topic startTime endTime");

  const lecture = await LectureSession.findById(lectureSessionId)
    .populate("subjectId", "subjectName subjectCode")
    .populate("sectionId", "name")
    .populate("facultyId", "employeeId");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance");

  // Title
  worksheet.mergeCells("A1:F1");
  worksheet.getCell("A1").value = `Attendance Report - ${lecture?.subjectId?.subjectName || "N/A"}`;
  worksheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
  worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 30;

  // Metadata
  worksheet.mergeCells("A2:F2");
  worksheet.getCell("A2").value = `Section: ${lecture?.sectionId?.name || "N/A"} | Date: ${new Date(lecture?.startTime).toLocaleDateString()} | Topic: ${lecture?.topic || "N/A"}`;
  worksheet.getCell("A2").font = { italic: true };
  worksheet.getRow(2).height = 20;

  worksheet.addRow([]);

  // Headers
  const headers = ["S.No", "Roll Number", "Student Name", "Email", "Status", "Marked At"];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF5B9BD5" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
  worksheet.getRow(4).height = 22;

  // Data rows
  attendances.forEach((att, idx) => {
    const row = worksheet.addRow([
      idx + 1,
      att.studentId?.rollNumber || "N/A",
      att.studentId?.name || "N/A",
      att.studentId?.email || "N/A",
      att.status,
      att.markedAt ? new Date(att.markedAt).toLocaleString() : "N/A",
    ]);

    const statusCell = row.getCell(5);
    if (att.status === "PRESENT") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6EFCE" } };
      statusCell.font = { color: { argb: "FF006100" } };
    } else {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC7CE" } };
      statusCell.font = { color: { argb: "FF9C0006" } };
    }
    statusCell.alignment = { horizontal: "center" };
    row.eachCell((cell) => { cell.alignment = { vertical: "middle" }; });
  });

  // Summary
  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
  const total = attendances.length;

  worksheet.addRow([]);
  const summaryStart = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${summaryStart}:F${summaryStart}`);
  worksheet.getCell(`A${summaryStart}`).value = "Summary";
  worksheet.getCell(`A${summaryStart}`).font = { bold: true, size: 12 };

  worksheet.addRow(["Total Students", total, "", "Present", presentCount, `${total > 0 ? ((presentCount / total) * 100).toFixed(2) : 0}%`]);
  worksheet.addRow(["", "", "", "Absent", absentCount, `${total > 0 ? ((absentCount / total) * 100).toFixed(2) : 0}%`]);

  worksheet.columns = [
    { width: 8 }, { width: 15 }, { width: 25 }, { width: 28 }, { width: 12 }, { width: 22 },
  ];

  return await workbook.xlsx.writeBuffer();
};

export default generateExcelBuffer;
