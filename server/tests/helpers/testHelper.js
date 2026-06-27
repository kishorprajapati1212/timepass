import axios from "axios";
import TEST_CONFIG from "../config/testConfig.js";
import logger from "../../utils/logger/logger.js";

// Store tokens and IDs globally for test flow
export const testStore = {
  adminToken: null,
  facultyToken: null,
  studentToken: null,
  adminId: null,
  facultyId: null,
  studentId: null,
  departmentId: null,
  subjectId: null,
  sectionId: null,
  assignmentId: null,
  lectureSessionId: null,
  qrCode: null,
};

// Axios instance with timing
export const api = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  timeout: TEST_CONFIG.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response time tracking
api.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    logger.apiCall(
      response.config.method.toUpperCase(),
      response.config.url,
      response.status,
      duration
    );
    return response;
  },
  (error) => {
    if (error.config?.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      logger.apiCall(
        error.config.method.toUpperCase(),
        error.config.url,
        error.response?.status || "NETWORK_ERROR",
        duration
      );
    }
    return Promise.reject(error);
  }
);

// Helper to set auth header
export const setAuthHeader = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Helper to clear auth header
export const clearAuthHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};

// Delay helper
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Test assertion helper
export const assert = {
  equals: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}: Expected ${expected}, got ${actual}`);
    }
  },

  true: (value, message) => {
    if (!value) {
      throw new Error(`${message}: Expected truthy, got ${value}`);
    }
  },

  false: (value, message) => {
    if (value) {
      throw new Error(`${message}: Expected falsy, got ${value}`);
    }
  },

  status: (status, expected, message) => {
    if (status !== expected) {
      throw new Error(`${message}: Expected status ${expected}, got ${status}`);
    }
  },

  hasProperty: (obj, prop, message) => {
    if (!(prop in obj)) {
      throw new Error(`${message}: Missing property '${prop}'`);
    }
  },

  arrayNotEmpty: (arr, message) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error(`${message}: Expected non-empty array`);
    }
  },
};

// Test runner
export const runTest = async (name, testFn) => {
  try {
    logger.info(`Running: ${name}`);
    await testFn();
    logger.success(`PASSED: ${name}`);
    return { name, status: "PASSED", error: null };
  } catch (error) {
    logger.error(`FAILED: ${name}`, {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { name, status: "FAILED", error: error.message };
  }
};

// Check server health before tests
export const checkServerHealth = async () => {
  try {
    const response = await api.get("/health");
    logger.success("Server is running and healthy", response.data);
    return true;
  } catch (error) {
    logger.error("Server health check failed", {
      error: error.message,
      url: TEST_CONFIG.BASE_URL,
    });
    logger.info("\n💡 Make sure your server is running:");
    logger.info("   cd server && npm run dev");
    return false;
  }
};
