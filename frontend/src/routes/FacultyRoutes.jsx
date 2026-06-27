import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AllStudents from "../pages/ContentPages/Faculty/pages/AllStudents";
import AttendancePage from "../pages/ContentPages/Faculty/pages/AttendancePage";
import FacultyProfile from "../pages/ContentPages/Faculty/pages/FacultyProfile";

const FacultyRoutes = () => {
  return (
    <Routes>
      <Route
        path="/get-all-students"
        element={
          <ProtectedRoute allowedRole="faculty">
            <AllStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/take-attendance"
        element={
          <ProtectedRoute allowedRole="faculty">
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default FacultyRoutes;