import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    // Prevent default form submission (which would refresh the page and lose all state)
    e.preventDefault();

    if (!email || !password) {
      /* If return wasn't used, it wouldn't exit early to stop the entire function. Here are the reasons why this is bad:
        - Wasted API Call: Wasting money/resources without a valid reason.
        - Confusing Error Messages: You'd show two errors (your custom "please fill..." message AND Firebase's error like "invalid email"), which confuses the user.
        - Unnecessary Loading State: You're showing a loading spinner for empty fields when you already know it will fail. Why waste the user's time?
        - Logic Issue: Why validate early if you're going to let invalid data through anyway? This is sloppy coding.
      */
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);

      await login(email, password);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      // Proper use case because, if switch is used, you'd have to use a fall back case (a second case for the same message (setError)).
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
        <h2>Member Login</h2>

        {/* Conditional rendering: it's saying if error is truthy, show the error in a <div> */}
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
      </div>
    </div>
  );
}
