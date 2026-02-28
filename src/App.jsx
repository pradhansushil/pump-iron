import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Payments from "./pages/Payments";
import MemberDashboard from "./pages/MemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MemberRoute from "./components/MemberRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar"; // Import the Navbar component
import Classes from "./pages/Classes";
import AdminMembers from "./pages/AdminMembers";
import AdminLayout from "./components/AdminLayout";

export default function App() {
  return (
    <div className="app">
      {/* Navbar component handles all navigation logic */}
      <Navbar />
      <Toaster position="top-right" />

      {/* Routes define which component renders for each URL path */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/classes" element={<Classes />} />
        <Route
          path="/dashboard"
          element={
            <MemberRoute>
              <MemberDashboard />
            </MemberRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <MemberRoute>
              <Payments />
            </MemberRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminMembers />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
