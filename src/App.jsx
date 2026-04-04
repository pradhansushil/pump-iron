import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { pageStyle } from "./utils/styles";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/public/Home";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/public/Signup";
import Navbar from "./components/Navbar";
import Employees from "./pages/public/Employees";
import Gallery from "./pages/public/Gallery";

import MemberRoute from "./components/routes/Member";
import AdminRoute from "./components/routes/Admin";
import PublicRoute from "./components/routes/Public";

import TourRequests from "./pages/admin/TourRequests";

import Payments from "./pages/Payments";
import MemberDashboard from "./pages/MemberDashboard";
import Classes from "./pages/Classes";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/Members";
import AdminLayout from "./components/admin/Layout";
import GalleryUpload from "./pages/admin/GalleryUpload";
import EmployeesTable from "./pages/admin/Employees";
import PaymentsTable from "./pages/admin/Payments";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/signup"].includes(location.pathname);

  const appStyle =
    !isAdminRoute && !isAuthRoute ? { paddingTop: "64px" } : null;

  return (
    <div className={`flex flex-col ${pageStyle}`} style={appStyle}>
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <Toaster position="top-right" />
      <ScrollToTop />
      <div className={`flex-1 ${!isAdminRoute && !isAuthRoute ? "pb-16" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
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
          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <AdminLayout>
                  <PaymentsTable />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </div>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </div>
  );
}
