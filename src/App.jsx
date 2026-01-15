import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MemberDashboard from "./pages/MemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MemberRoute from "./components/MemberRoute";
import AdminRoute from "./components/AdminRoute";
import GymTestPage from "./pages/GymTestPage";
import Navbar from "./components/Navbar"; // Import the Navbar component

export default function App() {
  return (
    <div className="app">
      {/* Navbar component handles all navigation logic */}
      <Navbar />

      {/* Routes define which component renders for each URL path */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <MemberRoute>
              <MemberDashboard />
            </MemberRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/test" element={<GymTestPage />} />
      </Routes>
    </div>
  );
}
