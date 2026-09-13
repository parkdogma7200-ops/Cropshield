import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until authentication has been checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return <Outlet />;
};

export default ProtectedRoute;