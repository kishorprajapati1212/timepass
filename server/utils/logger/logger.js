import chalk from "chalk";
import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const getLogFileName = () => {
  const date = new Date();
  return `test-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.log`;
};

const writeToFile = (level, message, data = null) => {
  const logFile = path.join(LOG_DIR, getLogFileName());
  const timestamp = getTimestamp();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? "\n" + JSON.stringify(data, null, 2) : ""}\n`;
  fs.appendFileSync(logFile, logEntry);
};

const logger = {
  info: (msg, data) => {
    console.log(chalk.blue("ℹ "), chalk.white(msg));
    if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
    writeToFile("info", msg, data);
  },

  success: (msg, data) => {
    console.log(chalk.green("✅ "), chalk.green.bold(msg));
    if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
    writeToFile("success", msg, data);
  },

  error: (msg, data) => {
    console.log(chalk.red("❌ "), chalk.red.bold(msg));
    if (data) console.log(chalk.red(JSON.stringify(data, null, 2)));
    writeToFile("error", msg, data);
  },

  warn: (msg, data) => {
    console.log(chalk.yellow("⚠ "), chalk.yellow(msg));
    if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
    writeToFile("warn", msg, data);
  },

  step: (num, msg) => {
    console.log(chalk.cyan(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
    console.log(chalk.cyan.bold(`  STEP ${num}: ${msg}`));
    console.log(chalk.cyan(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
    writeToFile("step", `STEP ${num}: ${msg}`);
  },

  divider: () => {
    console.log(chalk.gray("═══════════════════════════════════════════"));
  },

  summary: (pass, fail, total) => {
    console.log(chalk.cyan(`\n╔═══════════════════════════════════════════╗`));
    console.log(chalk.cyan(`║           TEST SUMMARY                    ║`));
    console.log(chalk.cyan(`╠═══════════════════════════════════════════╣`));
    console.log(chalk.cyan(`║  Total Tests:  ${String(total).padEnd(25)}║`));
    console.log(chalk.green(`║  Passed:      ${String(pass).padEnd(25)}║`));
    console.log(chalk.red(`║  Failed:      ${String(fail).padEnd(25)}║`));
    console.log(chalk.cyan(`╚═══════════════════════════════════════════╝`));

    const summaryData = { total, pass, fail, successRate: ((pass/total)*100).toFixed(2) + "%" };
    writeToFile("summary", `Test Summary: ${pass}/${total} passed`, summaryData);
  },

  apiCall: (method, endpoint, status, responseTime) => {
    const color = status >= 200 && status < 300 ? chalk.green : status >= 400 ? chalk.red : chalk.yellow;
    console.log(
      color(`${method.padEnd(6)} ${endpoint.padEnd(40)} → ${status} (${responseTime}ms)`)
    );
    writeToFile("api", `${method} ${endpoint} → ${status} (${responseTime}ms)`);
  },

  saveReport: (results) => {
    const reportFile = path.join(LOG_DIR, `report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
    console.log(chalk.blue(`\n📄 Full report saved to: ${reportFile}`));
    return reportFile;
  }
};

export default logger;
