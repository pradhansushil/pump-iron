import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function AdminRoute({ children }) {
  const { userRole } = useAuth();

  return (
    <ProtectedRoute>
      {userRole !== "admin" ? <Navigate to="/" replace /> : children}
    </ProtectedRoute>
  );
}
