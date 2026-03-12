import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "./Protected";
import LoadingSpinner from "../LoadingSpinner";

export default function AdminRoute({ children }) {
  const { userRole, loading } = useAuth();

  return (
    <ProtectedRoute>
      {loading ? (
        <LoadingSpinner message="Checking permissions..." />
      ) : userRole !== "admin" ? (
        <Navigate to="/" replace />
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
