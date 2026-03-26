import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { textColorWhite, textSizeSmall } from "../utils/styles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const message = sessionStorage.getItem("suspendedMessage");
    if (message) {
      setError(message);
      sessionStorage.removeItem("suspendedMessage");
    }
  }, []);

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
        navigate("/admin");
      } else if (user.role === "member") {
        navigate("/dashboard");
      } else {
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
    <main aria-labelledby="login-heading" className="flex h-screen">
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-950 to-blue-900 flex-col items-center justify-center p-12">
        <p className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">
          Pump & Iron
        </p>
        <h1
          className={`${textColorWhite} text-5xl font-bold text-center leading-tight mb-6`}
        >
          Train Hard.
          <br />
          Live
          <br />
          Strong.
        </h1>
        <div className="w-12 h-0.5 bg-blue-500 mb-6" />
        <p
          className={`text-gray-400 ${textSizeSmall} tracking-widest uppercase text-center`}
        >
          Your performance. Your community. Your gym.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-1/2 min-h-screen bg-white relative px-4">
        <div className="w-full max-w-[400px] flex flex-col space-y-6">
          <h2 id="login-heading" className="text-3xl font-bold text-gray-900">
            Sign In
          </h2>

          {error && (
            <p className="error-message text-red-500 text-sm" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="pt-2">
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
