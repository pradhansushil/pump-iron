import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicRoute({ children }) {
  const { userRole, currentUser, loading } = useAuth();

  if (loading) return null;

  if (userRole === "member" && currentUser) {
    return <Navigate to="/dashboard" replace />;
  } else if (userRole === "admin" && currentUser) {
    return <Navigate to="/admin" replace />;
  } else {
    return children;
  }
}
