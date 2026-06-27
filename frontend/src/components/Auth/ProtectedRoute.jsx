import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  const userRole = user.role?.toLowerCase();
  const requiredRole = allowedRole?.toLowerCase();
  if (requiredRole && userRole !== requiredRole) return <Navigate to={`/${userRole}`} replace />;
  return children;
};
export default ProtectedRoute;
