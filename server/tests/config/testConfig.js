// Test Configuration
import crypto from "crypto";

// Generate unique suffix for each test run to avoid duplicate key errors
// To this:
const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const TEST_CONFIG = {
  // Change this to your deployed URL or localhost
  BASE_URL: process.env.TEST_BASE_URL || "https://3000-firebase-impacthon-1768648789549.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev/",

 
  // Unique test data for each run
  TEST_ADMIN: {
    name: "Test Admin",
    email: `testadmin_${uniqueSuffix}@attendx.com`,
    password: "Admin@123",
    employeeId: `ADM${uniqueSuffix}`,
    phone: `987654${uniqueSuffix.slice(-4)}`,
  },
  
  TEST_FACULTY: {
    name: "Dr. Test Faculty",
    email: `testfaculty_${uniqueSuffix}@attendx.com`,
    password: "Faculty@123",
    employeeId: `FAC${uniqueSuffix}`,
    designation: "Professor",
    phone: `987655${uniqueSuffix.slice(-4)}`,
    specialization: "Computer Science",
  },
  
  TEST_STUDENT: {
    name: "Test Student",
    email: `teststudent_${uniqueSuffix}@attendx.com`,
    password: "Student@123",
    rollNumber: `STU${uniqueSuffix}`,
    enrollmentYear: 2026,
    semester: 1,
    phone: `987656${uniqueSuffix.slice(-4)}`,
    parentPhone: `987657${uniqueSuffix.slice(-4)}`,
  },
  
  TEST_DEPARTMENT: {
    name: `Computer Science ${uniqueSuffix}`,
    code: `CSE${uniqueSuffix.slice(-4)}`,
    description: "CS Department",
  },
  
  TEST_SUBJECT: {
    subjectName: `Data Structures ${uniqueSuffix}`,
    subjectCode: `CS${uniqueSuffix.slice(-6)}`,
    credits: 4,
    semester: 1,
  },
  
  TEST_SECTION: {
    name: `CS-A-${uniqueSuffix.slice(-4)}`,
    semester: 1,
    batchYear: 2026,
  },
  
  TEST_LECTURE: {
    topic: "Introduction to Arrays",
    description: "Basic array operations and complexity",
  },
  
  REQUEST_TIMEOUT: 15000,
  DELAY_BETWEEN_TESTS: 800,
};

export default TEST_CONFIG;
