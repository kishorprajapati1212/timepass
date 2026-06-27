import TEST_CONFIG from "./config/testConfig.js";
import logger from "../utils/logger/logger.js";
import {
  api,
  testStore,
  setAuthHeader,
  clearAuthHeader,
  delay,
  assert,
  runTest,
  checkServerHealth,
} from "./helpers/testHelper.js";

const results = [];

// ═══════════════════════════════════════════════════════════
// CORE FIX: Discover existing users and READ their section/
// department IDs. Then use those IDs for EVERYTHING else.
// ═══════════════════════════════════════════════════════════

const discoverEnvironment = async () => {
  logger.info("🔍 Discovery Phase: Reading existing database state...");

  // ─── 1. Admin ───
  clearAuthHeader();
  try {
    const res = await api.post("/admin/login", {
      email: TEST_CONFIG.TEST_ADMIN.email,
      password: TEST_CONFIG.TEST_ADMIN.password,
    });
    if (res.status === 200 && res.data.data?.token) {
      testStore.adminToken = res.data.data.token;
      testStore.adminId = res.data.data._id || res.data.data.admin?._id;
      logger.info("✅ Admin exists — token acquired");
    }
  } catch (e) {
    logger.info("ℹ️  Admin does not exist — will create fresh");
  }

  // ─── 2. Faculty ───
  clearAuthHeader();
  try {
    const res = await api.post("/faculty/login", {
      email: TEST_CONFIG.TEST_FACULTY.email,
      password: TEST_CONFIG.TEST_FACULTY.password,
    });
    if (res.status === 200 && res.data.data?.token) {
      testStore.facultyToken = res.data.data.token;
      setAuthHeader(testStore.facultyToken);
      const me = await api.get("/faculty/me");
      testStore.facultyId = me.data.data._id;
      logger.info(`✅ Faculty exists — id: ${testStore.facultyId}`);
    }
  } catch (e) {
    logger.info("ℹ️  Faculty does not exist — will create fresh");
  }

  // ─── 3. Student ───
  clearAuthHeader();
  try {
    const res = await api.post("/student/login", {
      email: TEST_CONFIG.TEST_STUDENT.email,
      password: TEST_CONFIG.TEST_STUDENT.password,
    });
    if (res.status === 200 && res.data.data?.token) {
      testStore.studentToken = res.data.data.token;
      testStore.studentId = res.data.data._id || res.data.data.student?._id;
      logger.info(`✅ Student exists — id: ${testStore.studentId}`);
    }
  } catch (e) {
    logger.info("ℹ️  Student does not exist — will create fresh");
  }

  // ─── 4. CRITICAL: If student exists, fetch their section & dept ───
  if (testStore.adminToken && testStore.studentId) {
    setAuthHeader(testStore.adminToken);
    try {
      const res = await api.get("/students");
      if (res.status === 200 && Array.isArray(res.data.data)) {
        const student = res.data.data.find(
          (s) => s._id === testStore.studentId || s.email === TEST_CONFIG.TEST_STUDENT.email
        );
        if (student) {
          // Handle both populated and unpopulated refs
          testStore.sectionId = student.sectionId?._id || student.sectionId;
          testStore.departmentId = student.departmentId?._id || student.departmentId;
          testStore.studentId = student._id; // ensure consistent
          logger.info(
            `📎 ANCHORING to Student's existing Section: ${testStore.sectionId}, Dept: ${testStore.departmentId}`
          );
        } else {
          logger.warn("⚠️  Student logged in but not found in /students list");
        }
      }
    } catch (e) {
      logger.warn("⚠️  Could not fetch /students to discover section/dept");
    }
  }

  // ─── 5. If faculty exists, ensure facultyId is known ───
  if (testStore.facultyToken && !testStore.facultyId) {
    setAuthHeader(testStore.facultyToken);
    try {
      const me = await api.get("/faculty/me");
      testStore.facultyId = me.data.data._id;
    } catch (e) {
      logger.warn("⚠️  Could not fetch faculty profile");
    }
  }

  logger.info("🔍 Discovery complete:");
  logger.info(`   Admin:    ${testStore.adminId ? "✅" : "❌"}`);
  logger.info(`   Faculty:  ${testStore.facultyId ? "✅" : "❌"}`);
  logger.info(`   Student:  ${testStore.studentId ? "✅" : "❌"}`);
  logger.info(`   Dept:     ${testStore.departmentId || "— (will create)"}`);
  logger.info(`   Section:  ${testStore.sectionId || "— (will create)"}`);
};

// ═══════════════════════════════════════════════════════════
// SETUP HELPERS — Create only what is missing.
// If student exists, ALL helpers reuse student's section/dept.
// ═══════════════════════════════════════════════════════════

const setupAdmin = async () => {
  if (testStore.adminToken) {
    logger.info("✅ Admin already exists — skipping creation");
    return;
  }
  clearAuthHeader();
  const res = await api.post("/admin/create", TEST_CONFIG.TEST_ADMIN);
  assert.status(res.status, 201, "Admin creation status");
  assert.hasProperty(res.data.data, "token", "Admin response has token");
  assert.hasProperty(res.data.data, "_id", "Admin response has _id");
  testStore.adminToken = res.data.data.token;
  testStore.adminId = res.data.data._id;
  logger.info("✅ Created new Admin");
};

const setupFaculty = async () => {
  if (testStore.facultyToken) {
    logger.info("✅ Faculty already exists — skipping creation");
    return;
  }
  setAuthHeader(testStore.adminToken);
  const res = await api.post("/faculty/create", TEST_CONFIG.TEST_FACULTY);
  assert.status(res.status, 201, "Faculty creation status");
  assert.hasProperty(res.data.data, "token", "Faculty response has token");
  testStore.facultyToken = res.data.data.token;
  setAuthHeader(testStore.facultyToken);
  const me = await api.get("/faculty/me");
  testStore.facultyId = me.data.data._id;
  logger.info(`✅ Created new Faculty: ${testStore.facultyId}`);
};

const setupDepartment = async () => {
  // If we already have a departmentId (from student discovery), verify it exists
  if (testStore.departmentId) {
    setAuthHeader(testStore.adminToken);
    try {
      const res = await api.get("/departments");
      const found = res.data.data.find(
        (d) => (d._id?._id || d._id) === testStore.departmentId
      );
      if (found) {
        logger.info(`✅ Reusing existing Department: ${testStore.departmentId}`);
        return;
      }
      logger.warn("⚠️  Student's department not found in list — will create new");
      testStore.departmentId = null; // force create
    } catch (e) {
      logger.warn("⚠️  Could not verify department — will create new");
      testStore.departmentId = null;
    }
  }
  // Create fresh department
  setAuthHeader(testStore.adminToken);
  const res = await api.post("/department/create", TEST_CONFIG.TEST_DEPARTMENT);
  assert.status(res.status, 201, "Department creation status");
  assert.hasProperty(res.data.data, "_id", "Department has _id");
  testStore.departmentId = res.data.data._id;
  logger.info(`✅ Created new Department: ${testStore.departmentId}`);
};

const setupSection = async () => {
  // If we already have a sectionId (from student discovery), verify it exists
  if (testStore.sectionId) {
    setAuthHeader(testStore.adminToken);
    try {
      const res = await api.get("/sections");
      const found = res.data.data.find(
        (s) => (s._id?._id || s._id) === testStore.sectionId
      );
      if (found) {
        logger.info(`✅ Reusing existing Section: ${testStore.sectionId}`);
        return;
      }
      logger.warn("⚠️  Student's section not found in list — will create new");
      testStore.sectionId = null; // force create
    } catch (e) {
      logger.warn("⚠️  Could not verify section — will create new");
      testStore.sectionId = null;
    }
  }
  // Create fresh section under current department
  setAuthHeader(testStore.adminToken);
  const payload = {
    ...TEST_CONFIG.TEST_SECTION,
    departmentId: testStore.departmentId,
  };
  const res = await api.post("/section/create", payload);
  assert.status(res.status, 201, "Section creation status");
  assert.hasProperty(res.data.data, "_id", "Section has _id");
  testStore.sectionId = res.data.data._id;
  logger.info(`✅ Created new Section: ${testStore.sectionId}`);
};

const setupSubject = async () => {
  // Try to find an existing subject linked to our current department
  setAuthHeader(testStore.adminToken);
  try {
    const res = await api.get("/subjects");
    if (res.status === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
      const subject = res.data.data.find(
        (s) => (s.departmentId?._id || s.departmentId) === testStore.departmentId
      ) || res.data.data[0];
      testStore.subjectId = subject._id?._id || subject._id;
      logger.info(`✅ Reusing existing Subject: ${testStore.subjectId}`);
      return;
    }
  } catch (e) {}
  // Create new subject under current department
  setAuthHeader(testStore.adminToken);
  const payload = {
    ...TEST_CONFIG.TEST_SUBJECT,
    departmentId: testStore.departmentId,
  };
  const res = await api.post("/subject/create", payload);
  assert.status(res.status, 201, "Subject creation status");
  assert.hasProperty(res.data.data, "_id", "Subject has _id");
  testStore.subjectId = res.data.data._id;
  logger.info(`✅ Created new Subject: ${testStore.subjectId}`);
};

const setupStudent = async () => {
  if (testStore.studentToken) {
    logger.info("✅ Student already exists — skipping creation");
    return;
  }
  // Student does NOT exist — create fresh, anchored to current section/dept
  setAuthHeader(testStore.adminToken);
  const studentData = {
    ...TEST_CONFIG.TEST_STUDENT,
    sectionId: testStore.sectionId,
    departmentId: testStore.departmentId,
  };
  const res = await api.post("/student/create", studentData);
  assert.status(res.status, 201, "Student creation status");
  assert.hasProperty(res.data.data, "token", "Student response has token");
  assert.hasProperty(res.data.data, "_id", "Student response has _id");
  testStore.studentToken = res.data.data.token;
  testStore.studentId = res.data.data._id;
  logger.info(`✅ Created new Student: ${testStore.studentId}`);
};

const setupFSS = async () => {
  if (!testStore.facultyId) {
    setAuthHeader(testStore.facultyToken);
    const me = await api.get("/faculty/me");
    testStore.facultyId = me.data.data._id;
  }
  // Check if mapping already exists for this exact combo
  setAuthHeader(testStore.facultyToken);
  try {
    const res = await api.get("/faculty/assignments");
    if (res.status === 200 && Array.isArray(res.data.data)) {
      const existing = res.data.data.find(
        (a) =>
          (a.facultyId?._id || a.facultyId) === testStore.facultyId &&
          (a.subjectId?._id || a.subjectId) === testStore.subjectId &&
          (a.sectionId?._id || a.sectionId) === testStore.sectionId
      );
      if (existing) {
        testStore.assignmentId = existing._id?._id || existing._id;
        logger.info(`✅ Reusing existing FSS mapping: ${testStore.assignmentId}`);
        return;
      }
    }
  } catch (e) {}
  // Create new FSS mapping
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
  logger.info(`✅ Created new FSS mapping: ${testStore.assignmentId}`);
};

// ═══════════════════════════════════════════════════════════
// TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════

const testCreateAdmin = async () => { await setupAdmin(); };

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

const testCreateFaculty = async () => { await setupFaculty(); };

const testFacultyLogin = async () => {
  clearAuthHeader();
  const res = await api.post("/faculty/login", {
    email: TEST_CONFIG.TEST_FACULTY.email,
    password: TEST_CONFIG.TEST_FACULTY.password,
  });
  assert.status(res.status, 200, "Faculty login status");
  testStore.facultyToken = res.data.data.token;
};

const testCreateDepartment = async () => { await setupDepartment(); };

const testGetDepartments = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.get("/departments");
  assert.status(res.status, 200, "Get departments status");
  assert.arrayNotEmpty(res.data.data, "Departments list not empty");
};

const testCreateSubject = async () => { await setupSubject(); };

const testGetSubjects = async () => {
  const res = await api.get("/subjects");
  assert.status(res.status, 200, "Get subjects status");
  assert.arrayNotEmpty(res.data.data, "Subjects list not empty");
};

const testCreateSection = async () => { await setupSection(); };

const testGetSections = async () => {
  setAuthHeader(testStore.adminToken);
  const res = await api.get("/sections");
  assert.status(res.status, 200, "Get sections status");
  assert.arrayNotEmpty(res.data.data, "Sections list not empty");
};

const testCreateStudent = async () => { await setupStudent(); };

const testStudentLogin = async () => {
  clearAuthHeader();
  const res = await api.post("/student/login", {
    email: TEST_CONFIG.TEST_STUDENT.email,
    password: TEST_CONFIG.TEST_STUDENT.password,
  });
  assert.status(res.status, 200, "Student login status");
  assert.hasProperty(res.data.data, "_id", "Student login has _id");
  testStore.studentToken = res.data.data.token;
  testStore.studentId = res.data.data._id;
};

const testCreateFacultySubjectSection = async () => { await setupFSS(); };

const testGetFacultyAssignments = async () => {
  setAuthHeader(testStore.facultyToken);
  const res = await api.get("/faculty/assignments");
  assert.status(res.status, 200, "Get faculty assignments status");
  assert.arrayNotEmpty(res.data.data, "Assignments list not empty");
};

const testStartLecture = async () => {
  if (!testStore.facultyId) {
    setAuthHeader(testStore.facultyToken);
    const facultyRes = await api.get("/faculty/me");
    testStore.facultyId = facultyRes.data.data._id;
  }
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
  logger.info(`✅ Lecture started: ${testStore.lectureSessionId}`);
  logger.info(`✅ QR Code captured (length: ${testStore.qrCode.length})`);
};

const testGetLiveQr = async () => {
  if (!testStore.lectureSessionId) throw new Error("SKIP: No lecture session ID");
  setAuthHeader(testStore.facultyToken);
  const res = await api.get(`/lecture/live-qr/${testStore.lectureSessionId}`);
  assert.status(res.status, 200, "Get live QR status");
  assert.hasProperty(res.data.data, "qrCode", "Live QR response has qrCode");
};

const testMarkAttendance = async () => {
  if (!testStore.qrCode) throw new Error("SKIP: No QR code");
  if (!testStore.studentId) throw new Error("SKIP: No student ID");
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
  if (!testStore.qrCode) throw new Error("SKIP: No QR code");
  setAuthHeader(testStore.studentToken);
  const payload = {
    qrData: testStore.qrCode,
    location: { lat: 28.6139, lng: 77.2090 },
  };
  try {
    await api.post("/student/mark", payload);
    throw new Error("Should have thrown duplicate error");
  } catch (error) {
    if (!error.response) throw error;
    assert.status(error.response.status, 400, "Duplicate attendance returns 400");
    assert.true(
      error.response.data.message.includes("already marked"),
      "Error message mentions already marked"
    );
  }
};

const testGetLectureAttendance = async () => {
  if (!testStore.lectureSessionId) throw new Error("SKIP: No lecture session ID");
  setAuthHeader(testStore.facultyToken);
  const res = await api.get(`/lecture/${testStore.lectureSessionId}`);
  assert.status(res.status, 200, "Get lecture attendance status");
  assert.hasProperty(res.data.data, "summary", "Response has summary");
  assert.hasProperty(res.data.data.summary, "present", "Summary has present count");
  assert.equals(res.data.data.summary.present, 1, "One student marked present");
};

const testGetStudentReport = async () => {
  setAuthHeader(testStore.studentToken);
  const res = await api.get("/api/report/student/my-attendance");
  assert.status(res.status, 200, "Student report status");
  assert.hasProperty(res.data.data, "summary", "Report has summary");
  assert.hasProperty(res.data.data.summary, "percentage", "Summary has percentage");
  assert.true(res.data.data.summary.totalLectures >= 0, "Total lectures is a number");
};

const testGetLectureSummary = async () => {
  if (!testStore.lectureSessionId) throw new Error("SKIP: No lecture session ID");
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
  if (!testStore.lectureSessionId) throw new Error("SKIP: No lecture session ID");
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
  if (!testStore.lectureSessionId) throw new Error("SKIP: No lecture session ID");
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
  // Flexible: accept either res.data.data or res.data as array
  const hasData = res.data.data !== undefined || Array.isArray(res.data);
  assert.true(hasData, "Response has data or is array");
};

const testEndLecture = async () => {
  if (!testStore.lectureSessionId) throw new Error("SKIP: No lecture session ID");
  setAuthHeader(testStore.facultyToken);
  const res = await api.post("/lecture/end", {
    lectureSessionId: testStore.lectureSessionId,
  });
  assert.status(res.status, 200, "Lecture end status");
  assert.hasProperty(res.data.data, "duration", "Response has duration");
};

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

// ═══════════════════════════════════════════════════════════
// MAIN RUNNER
// ═══════════════════════════════════════════════════════════

const runAllTests = async () => {
  logger.info("🚀 Starting AttendX Full Integration Tests (Section-Anchored)");
  logger.info(`🔗 Base URL: ${TEST_CONFIG.BASE_URL}`);
  logger.divider();

  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    logger.error("❌ Server is not running. Exiting tests.");
    process.exit(1);
  }

  await delay(1000);

  // PHASE 0: Discover existing users and anchor to student's section
  await discoverEnvironment();
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 1: Auth (create only if missing)
  logger.step(1, "AUTHENTICATION — Ensure Admin & Faculty");
  results.push(await runTest("Create Admin", testCreateAdmin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Admin Login", testAdminLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Create Faculty", testCreateFaculty));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Faculty Login", testFacultyLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 2: Academics — anchored to student's existing section/dept
  logger.step(2, "ACADEMICS — Ensure Department, Subject, Section");
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

  // PHASE 3: Student — create only if missing (will use section from above)
  logger.step(3, "AUTHENTICATION — Ensure Student");
  results.push(await runTest("Create Student", testCreateStudent));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Student Login", testStudentLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 4: Mapping — uses the SAME sectionId the student belongs to
  logger.step(4, "MAPPING — Assign Faculty to Subject & Section");
  results.push(await runTest("Create Faculty-Subject-Section", testCreateFacultySubjectSection));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Faculty Assignments", testGetFacultyAssignments));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 5: Lecture — starts for the SAME section the student belongs to
  logger.step(5, "LECTURE SESSION — Start Lecture & Get QR");
  results.push(await runTest("Start Lecture", testStartLecture));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Live QR", testGetLiveQr));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 6: Attendance — student marks attendance in THEIR section's lecture
  logger.step(6, "ATTENDANCE — Student Marks Attendance");
  results.push(await runTest("Mark Attendance", testMarkAttendance));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Duplicate Attendance Prevention", testDuplicateAttendance));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Lecture Attendance", testGetLectureAttendance));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 7: Reports
  logger.step(7, "REPORTS — View & Export Data");
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

  // PHASE 8: End Lecture
  logger.step(8, "LECTURE END — Close Session");
  results.push(await runTest("End Lecture", testEndLecture));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 9: Admin Views
  logger.step(9, "ADMIN VIEWS — Get All Users");
  results.push(await runTest("Get All Faculty", testGetAllFaculty));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get All Students", testGetAllStudents));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Get Faculty Profile", testGetFacultyProfile));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);

  // PHASE 10: Security
  logger.step(10, "ERROR & EDGE CASES — Security Tests");
  results.push(await runTest("Invalid Login", testInvalidLogin));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Unauthorized Access", testUnauthorizedAccess));
  await delay(TEST_CONFIG.DELAY_BETWEEN_TESTS);
  results.push(await runTest("Role-Based Access Control", testRoleBasedAccess));

  const passed = results.filter((r) => r.status === "PASSED").length;
  const failed = results.filter((r) => r.status === "FAILED").length;
  const skipped = results.filter((r) => r.status === "SKIPPED").length;

  logger.divider();
  logger.summary(passed, failed, results.length);
  if (skipped > 0) logger.info(`⏭️  ${skipped} test(s) skipped due to missing prerequisites`);

  const reportData = {
    timestamp: new Date().toISOString(),
    baseUrl: TEST_CONFIG.BASE_URL,
    total: results.length,
    passed,
    failed,
    skipped,
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

runAllTests().catch((err) => {
  logger.error("Fatal error running tests", err);
  process.exit(1);
});