import { Routes, Route, useLocation } from "react-router-dom";
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
import PublicRoute from "./components/PublicRoute";
import Employees from "./pages/Employees";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";
import TourRequests from "./pages/admin/TourRequests";
import GalleryUpload from "./pages/admin/GalleryUpload";
import EmployeesTable from "./pages/admin/Employees";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {/* Navbar component handles all navigation logic */}
      <Navbar />
      <Toaster position="top-right" />

      {/* Routes define which component renders for each URL path */}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route
          path="/dashboard"
          element={
            <MemberRoute>
              <MemberDashboard />
            </MemberRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <MemberRoute>
              <Profile />
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
        <Route
          path="/admin/tourRequests"
          element={
            <AdminRoute>
              <AdminLayout>
                <TourRequests />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <AdminRoute>
              <AdminLayout>
                <GalleryUpload />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <AdminRoute>
              <AdminLayout>
                <EmployeesTable />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
