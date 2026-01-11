import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  /* IMPORTANT: Wait for auth check to complete before redirecting.
  Without this, logged-in users get redirected to login on page refresh*/
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login and replace history to prevent back-button loops
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Step 8.5: Render the protected content if user is authenticated
  return children;
}
