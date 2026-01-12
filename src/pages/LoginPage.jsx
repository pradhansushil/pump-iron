/**
 * LoginPage Component
 *
 * Purpose: Authenticates existing users and routes them based on role.
 * - Admins → /admin
 * - Members → /dashboard
 * - Handles validation, error messages, and loading states
 *
 * Interview Notes:
 * - Demonstrates controlled form inputs and form validation
 * - Shows role-based routing/access control
 * - Uses AuthContext for centralized auth state management
 * - Implements proper error handling for async operations
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);

      const user = await login(email, password);

      if (user.role === "admin") {
        console.log("Navigating to /admin");
        navigate("/admin");
      } else if (user.role === "member") {
        console.log("Navigating to /dashboard");
        navigate("/dashboard");
      } else {
        console.log("Navigating to / (fallback)");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <h2>Sign In</h2>

        {error && <div>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div>
          {/* Link prevents full page reload and preserves app state*/}
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
