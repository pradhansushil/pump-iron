import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function MemberRoute({ children }) {
  const { userRole } = useAuth();

  return (
    <ProtectedRoute>
      {userRole !== "member" ? <Navigate to="/" replace /> : children}
    </ProtectedRoute>
  );
}
