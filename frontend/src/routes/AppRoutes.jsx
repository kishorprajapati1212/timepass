import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/authPages/Login";
import Register from "../pages/ContentPages/Admin/Register";
import Student from "../pages/ContentPages/Student/Student";
import Faculty from "../pages/ContentPages/Faculty/Faculty";
import Admin from "../pages/ContentPages/Admin/Admin";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Subject from "../pages/ContentPages/Admin/pages/Subject";
import AssignFaculty from "../pages/ContentPages/Admin/pages/AssignFaculty";
import AllStudents from "../pages/ContentPages/Faculty/pages/AllStudents";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={
        <ProtectedRoute allowedRole="student"><Student /></ProtectedRoute>
      } />
      <Route path="/faculty/*" element={
        <ProtectedRoute allowedRole="faculty"><Faculty /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin"><Admin /></ProtectedRoute>
      } />
      <Route path="/assign-faculty" element={
        <ProtectedRoute allowedRole="admin"><AssignFaculty /></ProtectedRoute>
      } />
      <Route path="/create-subject" element={
        <ProtectedRoute allowedRole="admin"><Subject /></ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute allowedRole="admin"><AllStudents /></ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
