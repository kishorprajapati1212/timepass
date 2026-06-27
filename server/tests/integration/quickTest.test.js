import TEST_CONFIG from "../config/testConfig.js";
import logger from "../../utils/logger/logger.js";
import { api, testStore, setAuthHeader, clearAuthHeader, delay, assert, runTest, checkServerHealth } from "../helpers/testHelper.js";

const results = [];

const quickSmokeTest = async () => {
  logger.info("🚀 Running Quick Smoke Test (5 essential APIs)");
  logger.info(`🔗 Base URL: ${TEST_CONFIG.BASE_URL}`);

  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    logger.error("❌ Server not running!");
    process.exit(1);
  }

  // 1. Create Admin
  results.push(await runTest("1. Create Admin", async () => {
    clearAuthHeader();
    const res = await api.post("/admin/create", TEST_CONFIG.TEST_ADMIN);
    assert.status(res.status, 201, "Status");
    testStore.adminToken = res.data.data.token;
  }));

  // 2. Create Faculty
  results.push(await runTest("2. Create Faculty", async () => {
    setAuthHeader(testStore.adminToken);
    const res = await api.post("/faculty/create", TEST_CONFIG.TEST_FACULTY);
    assert.status(res.status, 201, "Status");
    testStore.facultyToken = res.data.data.token;
  }));

  // 3. Create Department
  results.push(await runTest("3. Create Department", async () => {
    setAuthHeader(testStore.adminToken);
    const res = await api.post("/department/create", TEST_CONFIG.TEST_DEPARTMENT);
    assert.status(res.status, 201, "Status");
    testStore.departmentId = res.data.data._id;
  }));

  // 4. Faculty Login
  results.push(await runTest("4. Faculty Login", async () => {
    clearAuthHeader();
    const res = await api.post("/faculty/login", {
      email: TEST_CONFIG.TEST_FACULTY.email,
      password: TEST_CONFIG.TEST_FACULTY.password,
    });
    assert.status(res.status, 200, "Status");
    testStore.facultyToken = res.data.data.token;
  }));

  // 5. Get Faculty Profile
  results.push(await runTest("5. Get Faculty Profile", async () => {
    setAuthHeader(testStore.facultyToken);
    const res = await api.get("/faculty/me");
    assert.status(res.status, 200, "Status");
  }));

  const passed = results.filter(r => r.status === "PASSED").length;
  const failed = results.filter(r => r.status === "FAILED").length;

  logger.summary(passed, failed, results.length);

  if (failed > 0) process.exit(1);
  else process.exit(0);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  quickSmokeTest().catch(err => {
    logger.error("Fatal error", err);
    process.exit(1);
  });
}

export default quickSmokeTest;
