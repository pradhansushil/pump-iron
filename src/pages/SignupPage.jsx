/**
 * SignupPage Component
 *
 * Purpose: Registers new users and automatically logs them in as "member" role.
 * - All new users → /dashboard (default member role)
 * - Validates password confirmation before submission
 * - Handles validation, error messages, and loading states
 *
 * Interview Notes:
 * - Demonstrates controlled form inputs with multi-field validation
 * - Shows client-side password matching validation
 * - Uses AuthContext for centralized auth state management
 * - Implements proper error handling with user-friendly messages
 * - Automatic login after signup for streamlined UX
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      // Clear any previous errors and set loading
      setError("");
      setLoading(true);

      // Call signup function from AuthContext
      await signup(email, password, "member");

      // New users are always "member" role, navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Extract a user-friendly message
      let friendlyMessage = err.message;

      if (err.code === "auth/email-already-in-use") {
        friendlyMessage =
          "This email is already registered. Please log in or use a different email.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      }

      setError(friendlyMessage);
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Sign Up</h2>

        {error && <div>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
