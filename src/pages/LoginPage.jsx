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
      {/* Left brand panel */}
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

      {/* Right form panel */}
      <div className="flex flex-col justify-center w-full md:w-1/2 h-full px-16 bg-gray-950">
        <div className="w-full max-w-sm mx-auto">
          <h2
            id="login-heading"
            className={`${textColorWhite} text-3xl font-bold mb-8`}
          >
            Sign In
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-6" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Email
              </label>
              <input
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Password
              </label>
              <input
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold tracking-wide hover:bg-blue-600 transition-colors duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
