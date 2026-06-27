import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";

// Route imports
import adminRoutes from "./routes/auth/admin.routes.js";
import facultyRoutes from "./routes/auth/faculty.routes.js";
import studentRoutes from "./routes/auth/student.routes.js";
import subjectRoutes from "./routes/academics/subject.routes.js";
import departmentRoutes from "./routes/academics/department.routes.js";
import sectionRoutes from "./routes/academics/section.routes.js";
import mappingRoutes from "./routes/mapping/facultySubjectSection.routes.js";
import lectureRoutes from "./routes/lecture/lectureSession.routes.js";
import attendanceRoutes from "./routes/attendance/attendance.routes.js";
import reportRoutes from "./routes/report/report.routes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Connect DB
await connectDB();
dotenv.config();

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Rate limit auth routes
app.use("/admin/login", authLimiter);
app.use("/faculty/login", authLimiter);
app.use("/student/login", authLimiter);

// API Routes
app.use(adminRoutes);
app.use(facultyRoutes);
app.use(studentRoutes);
app.use(subjectRoutes);
app.use(departmentRoutes);
app.use(sectionRoutes);
app.use(mappingRoutes);
app.use(lectureRoutes);
app.use(attendanceRoutes);
app.use(reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
