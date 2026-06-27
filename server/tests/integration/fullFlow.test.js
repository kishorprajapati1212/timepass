import TEST_CONFIG from "../config/testConfig.js";
import logger from "../../utils/logger/logger.js";
import {
  api,
  testStore,
  setAuthHeader,
  clearAuthHeader,
  delay,
  assert,
  runTest,
  checkServerHealth,
} from "../helpers/testHelper.js";

// Results tracking
const results = [];

// ============================================
// STEP 1: AUTH TESTS
// ============================================
const testCreateAdmin = async () => {
  clearAuthHeader();
  const res = await api.post("/admin/create", TEST_CONFIG.TEST_ADMIN);
  assert.status(res.status, 201, "Admin creation status");
  assert.hasProperty(res.data.data, "token", "Admin response has token");
  assert.hasProperty(res.data.data, "_id", "Admin response has _id");
  testStore.adminToken = res.data.data.token;
  testStore.adminId = res.data.data._id;
};

const testAdminLogin = async () => {
  clearAuthHeader();
  const res = await api.post("/admin/login", {
    email: TEST_CONFIG.TEST_ADMIN.email,
    password: TEST_CONFIG.TEST_ADMIN.password,
  });
  assert.status(res.status, 200, "Admin login status");
  assert.hasProperty(res.data.data, "token", "Login response has token");
  testStore.adminToken = res.data.data.token;
};

const testCreateFaculty = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.post("/faculty/create", TEST_CONFIG.TEST_FACULTY);
  assert.status(res.status, 201, "Faculty creation status");
  assert.hasProperty(res.data.data, "token", "Faculty response has token");
  testStore.facultyToken = res.data.data.token;
};

const testFacultyLogin = async () => {
  clearAuthHeader();
  const res = await api.post("/faculty/login", {
    email: TEST_CONFIG.TEST_FACULTY.email,
    password: TEST_CONFIG.TEST_FACULTY.password,
  });
  assert.status(res.status, 200, "Faculty login status");
  testStore.facultyToken = res.data.data.token;
};

const testCreateStudent = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.post("/student/create", TEST_CONFIG.TEST_STUDENT);
  assert.status(res.status, 201, "Student creation status");
  assert.hasProperty(res.data.data, "token", "Student response has token");
  testStore.studentToken = res.data.data.token;
};

const testStudentLogin = async () => {
  clearAuthHeader();
  const res = await api.post("/student/login", {
    email: TEST_CONFIG.TEST_STUDENT.email,
    password: TEST_CONFIG.TEST_STUDENT.password,
  });
  assert.status(res.status, 200, "Student login status");
  testStore.studentToken = res.data.data.token;
};

// ============================================
// STEP 2: ACADEMICS TESTS
// ============================================
const testCreateDepartment = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.post("/department/create", TEST_CONFIG.TEST_DEPARTMENT);
  assert.status(res.status, 201, "Department creation status");
  assert.hasProperty(res.data.data, "_id", "Department has _id");
  testStore.departmentId = res.data.data._id;
};

const testGetDepartments = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.get("/departments");
  assert.status(res.status, 200, "Get departments status");
  assert.arrayNotEmpty(res.data.data, "Departments list not empty");
};

const testCreateSubject = async () => {
  setAuthHeader(testStore.adminToken);
  const payload = {
    ...TEST_CONFIG.TEST_SUBJECT,
    departmentId: testStore.departmentId,
  };
  const res = await api.post("/subject/create", payload);
  assert.status(res.status, 201, "Subject creation status");
  assert.hasProperty(res.data.data, "_id", "Subject has _id");
  testStore.subjectId = res.data.data._id;
};

const testGetSubjects = async () => {
  const res = await api.get("/subjects");
  assert.status(res.status, 200, "Get subjects status");
  assert.arrayNotEmpty(res.data.data, "Subjects list not empty");
};

const testCreateSection = async () => {
  setAuthHeader(testStore.adminToken);
  const payload = {
    ...TEST_CONFIG.TEST_SECTION,
    departmentId: testStore.departmentId,
  };
  const res = await api.post("/section/create", payload);
  assert.status(res.status, 201, "Section creation status");
  assert.hasProperty(res.data.data, "_id", "Section has _id");
  testStore.sectionId = res.data.data._id;
};

const testGetSections = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.get("/sections");
  assert.status(res.status, 200, "Get sections status");
  assert.arrayNotEmpty(res.data.data, "Sections list not empty");
};

// ============================================
// STEP 3: MAPPING TESTS
// ============================================
const testCreateFacultySubjectSection = async () => {
  setAuthHeader(testStore.adminToken);

  // Get faculty profile ID
  setAuthHeader(testStore.facultyToken);
  const facultyRes = await api.get("/faculty/me");
  testStore.facultyId = facultyRes.data.data._id;

  setAuthHeader(testStore.adminToken);
  const payload = {
    facultyId: testStore.facultyId,
    subjectId: testStore.subjectId,
    sectionId: testStore.sectionId,
    academicYear: 2026,
    semester: 1,
  };
  const res = await api.post("/faculty-subject-section", payload);
  assert.status(res.status, 201, "FSS creation status");
  assert.hasProperty(res.data.data, "_id", "FSS has _id");
  testStore.assignmentId = res.data.data._id;
};

const testGetFacultyAssignments = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get("/faculty/assignments");
  assert.status(res.status, 200, "Get faculty assignments status");
  assert.arrayNotEmpty(res.data.data, "Assignments list not empty");
};

// ============================================
// STEP 4: LECTURE SESSION TESTS
// ============================================
const testStartLecture = async () => {
  setAuthHeader(testStore.facultyToken);
  const payload = {
    ...TEST_CONFIG.TEST_LECTURE,
    subjectId: testStore.subjectId,
    sectionId: testStore.sectionId,
  };
  const res = await api.post("/lecture/start", payload);
  assert.status(res.status, 201, "Lecture start status");
  assert.hasProperty(res.data.data, "lectureSessionId", "Lecture has session ID");
  assert.hasProperty(res.data.data, "qrCode", "Lecture has QR code");
  testStore.lectureSessionId = res.data.data.lectureSessionId;
  testStore.qrCode = res.data.data.qrCode;
};

const testGetLiveQr = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get(`/lecture/live-qr/${testStore.lectureSessionId}`);
  assert.status(res.status, 200, "Get live QR status");
  assert.hasProperty(res.data.data, "qrCode", "Live QR response has qrCode");
};

// ============================================
// STEP 5: ATTENDANCE TESTS
// ============================================
const testMarkAttendance = async () => {
  setAuthHeader(testStore.studentToken);
  const payload = {
    qrData: testStore.qrCode,
    location: { lat: 28.6139, lng: 77.2090 },
  };
  const res = await api.post("/student/mark", payload);
  assert.status(res.status, 201, "Mark attendance status");
  assert.equals(res.data.data.status, "PRESENT", "Attendance status is PRESENT");
  assert.hasProperty(res.data.data, "markedAt", "Attendance has markedAt");
};

const testDuplicateAttendance = async () => {
  setAuthHeader(testStore.studentToken);
  const payload = {
    qrData: testStore.qrCode,
    location: { lat: 28.6139, lng: 77.2090 },
  };
  try {
    await api.post("/student/mark", payload);
    throw new Error("Should have thrown duplicate error");
  } catch (error) {
    assert.status(error.response.status, 400, "Duplicate attendance returns 400");
    assert.true(
      error.response.data.message.includes("already marked"),
      "Error message mentions already marked"
    );
  }
};

const testGetLectureAttendance = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get(`/lecture/${testStore.lectureSessionId}`);
  assert.status(res.status, 200, "Get lecture attendance status");
  assert.hasProperty(res.data.data, "summary", "Response has summary");
  assert.hasProperty(res.data.data.summary, "present", "Summary has present count");
  assert.equals(res.data.data.summary.present, 1, "One student marked present");
};

// ============================================
// STEP 6: REPORT TESTS
// ============================================
const testGetStudentReport = async () => {
  setAuthHeader(testStore.studentToken);
  const res = await api.get("/api/report/student/my-attendance");
  assert.status(res.status, 200, "Student report status");
  assert.hasProperty(res.data.data, "summary", "Report has summary");
  assert.hasProperty(res.data.data.summary, "percentage", "Summary has percentage");
  assert.equals(res.data.data.summary.totalLectures, 1, "One lecture attended");
};

const testGetLectureSummary = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get(`/api/report/lecture/${testStore.lectureSessionId}/summary`);
  assert.status(res.status, 200, "Lecture summary status");
  assert.hasProperty(res.data.data, "lectureInfo", "Summary has lectureInfo");
  assert.hasProperty(res.data.data, "students", "Summary has students list");
};

const testGetFacultyDashboard = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get("/api/report/faculty/dashboard");
  assert.status(res.status, 200, "Faculty dashboard status");
  assert.hasProperty(res.data.data, "stats", "Dashboard has stats");
  assert.hasProperty(res.data.data.stats, "totalLectures", "Stats has totalLectures");
};

const testDownloadExcel = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get(`/api/report/lecture/${testStore.lectureSessionId}/download`, {
    responseType: "arraybuffer",
  });
  assert.status(res.status, 200, "Excel download status");
  assert.true(res.data.length > 0, "Excel file has content");
  assert.true(
    res.headers["content-type"].includes("spreadsheet"),
    "Content-Type is Excel"
  );
};

const testUploadToCloud = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.post(`/api/report/lecture/${testStore.lectureSessionId}/upload`);
  assert.status(res.status, 201, "Cloud upload status");
  assert.hasProperty(res.data.data, "downloadUrl", "Upload response has downloadUrl");
  assert.true(
    res.data.data.downloadUrl.includes("cloudinary"),
    "Download URL is from Cloudinary"
  );
};

const testGetSavedReports = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get("/api/report/saved-reports");
  assert.status(res.status, 200, "Saved reports status");
  assert.hasProperty(res.data, "data", "Response has data");
};

// ============================================
// STEP 7: END LECTURE
// ============================================
const testEndLecture = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.post("/lecture/end", {
    lectureSessionId: testStore.lectureSessionId,
  });
  assert.status(res.status, 200, "Lecture end status");
  assert.hasProperty(res.data.data, "duration", "Response has duration");
};

// ============================================
// STEP 8: GET ALL USERS (Admin)
// ============================================
const testGetAllFaculty = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.get("/faculty");
  assert.status(res.status, 200, "Get all faculty status");
  assert.arrayNotEmpty(res.data.data, "Faculty list not empty");
};

const testGetAllStudents = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.get("/students");
  assert.status(res.status, 200, "Get all students status");
  assert.arrayNotEmpty(res.data.data, "Students list not empty");
};

const testGetFacultyProfile = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get("/faculty/me");
  assert.status(res.status, 200, "Get faculty profile status");
  assert.hasProperty(res.data.data, "userId", "Profile has userId");
};

// ============================================
// STEP 9: ERROR & EDGE CASE TESTS
// ============================================
const testInvalidLogin = async () => {
  clearAuthHeader();
  try {
    await api.post("/student/login", {
      email: "wrong@email.com",
      password: "wrongpassword",
    });
    throw new Error("Should have thrown error");
  } catch (error) {
    assert.status(error.response.status, 401, "Invalid login returns 401");
  }
};

const testUnauthorizedAccess = async () => {
  clearAuthHeader();
  try {
    await api.get("/faculty");
    throw new Error("Should have thrown error");
  } catch (error) {
    assert.status(error.response.status, 401, "No token returns 401");
  }
};

const testRoleBasedAccess = async () => {
  setAuthHeader(testStore.studentToken);
  try {
    await api.post("/faculty/create", TEST_CONFIG.TEST_FACULTY);
    throw new Error("Should have thrown error");
  } catch (error) {
    assert.status(error.response.status, 403, "Student creating faculty returns 403");
  }
};

// ============================================
// MAIN TEST RUNNER
// ============================================
const runAllTests = async () => {
  logger.info("🚀 Starting AttendX Full Integration Tests");
  logger.info(`🔗 Base URL: ${TEST_CONFIG.BASE_URL}`);
  logger.divider();

  // Check server health
  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    logger.error("❌ Server is not running. Exiting tests.");
    process.exit(1);
  }

  await delay(1000);

  // STEP 1: AUTH
  logger.step(1, "AUTHENTICATION - Create & Login Users");
  results.push(await runTest("Create Admin", testCreateAdmin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Admin Login", testAdminLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Create Faculty", testCreateFaculty));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Faculty Login", testFacultyLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Create Student", testCreateStudent));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Student Login", testStudentLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 2: ACADEMICS
  logger.step(2, "ACADEMICS - Create Department, Subject, Section");
  results.push(await runTest("Create Department", testCreateDepartment));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Departments", testGetDepartments));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Create Subject", testCreateSubject));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Subjects", testGetSubjects));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Create Section", testCreateSection));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Sections", testGetSections));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 3: MAPPING
  logger.step(3, "MAPPING - Assign Faculty to Subject & Section");
  results.push(await runTest("Create Faculty-Subject-Section", testCreateFacultySubjectSection));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Faculty Assignments", testGetFacultyAssignments));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 4: LECTURE
  logger.step(4, "LECTURE SESSION - Start Lecture & Get QR");
  results.push(await runTest("Start Lecture", testStartLecture));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Live QR", testGetLiveQr));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 5: ATTENDANCE
  logger.step(5, "ATTENDANCE - Student Marks Attendance");
  results.push(await runTest("Mark Attendance", testMarkAttendance));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Duplicate Attendance Prevention", testDuplicateAttendance));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Lecture Attendance", testGetLectureAttendance));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 6: REPORTS
  logger.step(6, "REPORTS - View & Export Data");
  results.push(await runTest("Student Report", testGetStudentReport));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Lecture Summary", testGetLectureSummary));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Faculty Dashboard", testGetFacultyDashboard));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Download Excel", testDownloadExcel));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Upload to Cloud", testUploadToCloud));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Saved Reports", testGetSavedReports));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 7: END LECTURE
  logger.step(7, "LECTURE END - Close Session");
  results.push(await runTest("End Lecture", testEndLecture));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 8: ADMIN VIEWS
  logger.step(8, "ADMIN VIEWS - Get All Users");
  results.push(await runTest("Get All Faculty", testGetAllFaculty));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get All Students", testGetAllStudents));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Faculty Profile", testGetFacultyProfile));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // STEP 9: ERROR CASES
  logger.step(9, "ERROR & EDGE CASES - Security Tests");
  results.push(await runTest("Invalid Login", testInvalidLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Unauthorized Access", testUnauthorizedAccess));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Role-Based Access Control", testRoleBasedAccess));

  // SUMMARY
  const passed = results.filter((r) => r.status === "PASSED").length;
  const failed = results.filter((r) => r.status === "FAILED").length;

  logger.divider();
  logger.summary(passed, failed, results.length);

  // Save detailed report
  const reportData = {
    timestamp: new Date().toISOString(),
    baseUrl: TEST_CONFIG.BASE_URL,
    total: results.length,
    passed,
    failed,
    successRate: ((passed / results.length) * 100).toFixed(2) + "%",
    results,
    testStore: {
      adminId: testStore.adminId,
      facultyId: testStore.facultyId,
      studentId: testStore.studentId,
      departmentId: testStore.departmentId,
      subjectId: testStore.subjectId,
      sectionId: testStore.sectionId,
      lectureSessionId: testStore.lectureSessionId,
    },
  };

  const reportFile = logger.saveReport(reportData);

  if (failed > 0) {
    logger.error(`\n❌ ${failed} test(s) failed!`);
    logger.info("📄 Check logs/ folder for detailed error logs");
    process.exit(1);
  } else {
    logger.success("\n🎉 All tests passed!");
    logger.info(`📄 Report saved to: ${reportFile}`);
    process.exit(0);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch((err) => {
    logger.error("Fatal error running tests", err);
    process.exit(1);
  });
}

export default runAllTests;
