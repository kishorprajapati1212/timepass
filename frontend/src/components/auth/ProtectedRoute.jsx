import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const stored = JSON.parse(localStorage.getItem("attendx_user"));

  if (!stored || !stored.token) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 FIX: support both structures
  const userRole =
    stored?.user?.role?.toLowerCase() || stored?.role?.toLowerCase();

  if (allowedRole && userRole !== allowedRole.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;