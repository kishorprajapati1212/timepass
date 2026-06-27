# AttendX Server

Complete Attendance Management System Backend with QR-based attendance, lecture sessions, role-based access, and Excel export.

## 🚀 Features

- **Multi-role Auth**: Admin, Faculty, Student with JWT
- **QR-based Attendance**: Dynamic QR codes with auto-rotation
- **Lecture Sessions**: Start/end with real-time monitoring
- **Excel Export**: Direct download (Render-friendly) + Cloudinary upload
- **Reports**: Student self-view, Faculty dashboard, Lecture summaries
- **Security**: Helmet, rate limiting, JWT auth, role-based access
- **Auto-Testing**: Full integration test suite with colored logging

## 📦 Installation

```bash
npm install
```

## ⚙️ Environment Variables

Create `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

## 🏃 Run Server

```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 Run Tests

```bash
# Full integration test (all 24 APIs)
npm test
# OR
npm run test:full

# Quick smoke test (5 essential APIs)
npm run test:quick

# View logs
npm run logs

# Tail logs
npm run logs:tail
```

### Test Against Deployed Server

```bash
TEST_BASE_URL=https://your-api.onrender.com npm test
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/admin/create` | ❌ | - | Create admin |
| POST | `/admin/login` | ❌ | - | Admin login |
| POST | `/faculty/create` | ✅ | ADMIN | Create faculty |
| POST | `/faculty/login` | ❌ | - | Faculty login |
| GET | `/faculty` | ✅ | ADMIN | List faculty |
| GET | `/faculty/me` | ✅ | FACULTY | My profile |
| POST | `/student/create` | ✅ | ADMIN | Create student |
| POST | `/student/login` | ❌ | - | Student login |
| GET | `/students` | ✅ | ADMIN,FACULTY | List students |

### Academics
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/department/create` | ✅ | ADMIN | Create department |
| GET | `/departments` | ✅ | ADMIN | List departments |
| POST | `/subject/create` | ✅ | ADMIN | Create subject |
| GET | `/subjects` | ❌ | - | List subjects |
| POST | `/section/create` | ✅ | ADMIN | Create section |
| GET | `/sections` | ✅ | ADMIN | List sections |

### Mapping
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/faculty-subject-section` | ✅ | ADMIN | Assign faculty |
| GET | `/faculty/assignments` | ✅ | FACULTY, ADMIN | My assignments |

### Lecture
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/lecture/start` | ✅ | FACULTY, ADMIN | Start lecture |
| POST | `/lecture/end` | ✅ | FACULTY, ADMIN | End lecture |
| GET | `/lecture/live-qr/:id` | ✅ | FACULTY, ADMIN | Get live QR |

### Attendance
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/student/mark` | ✅ | STUDENT | Mark via QR |
| GET | `/lecture/:id` | ✅ | FACULTY, ADMIN | View attendance |

### Reports & Excel
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/report/student/my-attendance` | ✅ | STUDENT | My report |
| GET | `/api/report/lecture/:id/summary` | ✅ | FACULTY, ADMIN | Lecture summary |
| GET | `/api/report/faculty/dashboard` | ✅ | FACULTY | Dashboard stats |
| GET | `/api/report/lecture/:id/download` | ✅ | FACULTY, ADMIN | **Download Excel** |
| POST | `/api/report/lecture/:id/upload` | ✅ | FACULTY, ADMIN | Upload to Cloud |
| GET | `/api/report/saved-reports` | ✅ | FACULTY, ADMIN | List saved reports |

## 🗂️ Project Structure

```
server/
├── config/               # DB, Cache, Cloudinary config
├── controllers/          # Business logic
│   ├── auth/            # Admin, Faculty, Student auth
│   ├── academics/       # Department, Subject, Section
│   ├── attendance/      # Mark & view attendance
│   ├── lecture/         # Start/end lecture sessions
│   ├── mapping/         # Faculty-Subject-Section mapping
│   └── report/          # Excel export & reports
├── middleware/          # Auth, Role, Identity, Error handling
├── models/             # Mongoose schemas
│   ├── Academics/       # Department, Subject, Section
│   ├── Attendance/      # Attendance records
│   ├── lecture/         # LectureSession
│   ├── mapping/         # FacultySubjectSection
│   ├── Report/          # Saved reports
│   └── users/           # User, Admin, Faculty, Student
├── routes/             # API route definitions
├── services/           # Business services (QR scheduler)
├── tests/              # Integration tests
│   ├── config/          # Test configuration
│   ├── helpers/         # Test utilities
│   ├── integration/     # Test suites
│   ├── fullTest.js      # Full integration test
│   └── quickTest.js     # Quick smoke test
├── uploads/            # File uploads
├── utils/              # Utilities
│   ├── logger/          # Colored console + file logger
│   ├── generateToken.js # JWT token generator
│   ├── generateQR.js    # QR code generator
│   └── excelGenerator.js # Excel buffer generator
├── index.js            # Main entry point
└── package.json
```

## 🎯 Render Deployment

The Excel export uses **in-memory generation** — no files saved on disk. Perfect for Render's ephemeral filesystem.

## 🧪 Test Flow

```
1. Create Admin → Login Admin
2. Create Faculty → Login Faculty
3. Create Student → Login Student
4. Create Department → Create Subject → Create Section
5. Assign Faculty to Subject+Section
6. Faculty starts Lecture → QR generated
7. Student scans QR → Attendance marked
8. Faculty views live attendance
9. Student views own report
10. Faculty downloads Excel / uploads to Cloud
11. Faculty ends lecture
12. Admin views all users
13. Security tests (invalid login, unauthorized access, role checks)
```

## 📄 License

ISC
