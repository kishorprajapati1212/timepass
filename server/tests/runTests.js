#!/usr/bin/env node

/**
 * AttendX Test Runner
 * 
 * Usage:
 *   node tests/runTests.js              → Run full integration test
 *   node tests/runTests.js --quick      → Run quick smoke test
 *   node tests/runTests.js --help       → Show help
 * 
 * Environment:
 *   TEST_BASE_URL=http://localhost:3000 node tests/runTests.js
 */

import logger from "../utils/logger/logger.js";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           ATTENDX TEST RUNNER                            ║
╠═══════════════════════════════════════════════════════════╣
║  Usage:                                                   ║
║    node tests/runTests.js              Full integration   ║
║    node tests/runTests.js --quick      Quick smoke test  ║
║    node tests/runTests.js --help       Show this help    ║
║                                                           ║
║  Environment Variables:                                   ║
║    TEST_BASE_URL=http://localhost:3000  Server URL        ║
║                                                           ║
║  Example:                                                 ║
║    TEST_BASE_URL=https://api.attendx.com node tests/runTests.js --quick
╚═══════════════════════════════════════════════════════════╝
`);
  process.exit(0);
}

logger.info("🧪 AttendX Test Runner");
logger.divider();

if (args.includes("--quick")) {
  logger.info("Running QUICK SMOKE TEST (5 essential APIs)...");
  const { default: quickTest } = await import("./integration/quickTest.test.js");
  await quickTest();
} else {
  logger.info("Running FULL INTEGRATION TEST (all APIs)...");
  const { default: fullTest } = await import("./integration/fullFlow.test.js");
  await fullTest();
}
