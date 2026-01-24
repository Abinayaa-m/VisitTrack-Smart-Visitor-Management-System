import { Navigate, Outlet } from "react-router-dom";
import { getToken, getRoleFromToken } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles }) {
  
  const token = getToken();
  const userRole = getRoleFromToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
