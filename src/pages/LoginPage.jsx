import { useState } from "react";

export default function LoginPage() {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error handling and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Firebase login will go here in the next phase
      console.log("Login attempt with:", email);

      // Simulating async operation for now
      // Note: When you're not actually calling a function that would cause you to wait, you have to create your own promise, which is what we're doing here. If there's an actual task that calls to be to waited, then, it will already give you a promise internally.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError("Failed to log in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Gym Manager</h1>
      <p>Sign in to your account</p>

      {error && <div>{error}</div>}

      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          disabled={loading}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}
