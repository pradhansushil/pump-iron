import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public-facing pages
import Home from "./pages/public/Home";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/public/Signup";
import Navbar from "./components/Navbar";
import Employees from "./pages/public/Employees";
import Gallery from "./pages/public/Gallery";

// Routes
import MemberRoute from "./components/routes/Member";
import AdminRoute from "./components/routes/Admin";
import PublicRoute from "./components/routes/Public";

// Member pages
import Payments from "./pages/Payments";
import MemberDashboard from "./pages/MemberDashboard";
import Classes from "./pages/Classes";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/Members";
import AdminLayout from "./components/admin/Layout";
import TourRequests from "./pages/admin/TourRequests";
import GalleryUpload from "./pages/admin/GalleryUpload";
import EmployeesTable from "./pages/admin/Employees";
import PaymentsTable from "./pages/admin/Payments";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const appStyle = !isAdminRoute ? { paddingTop: "64px" } : null;

  return (
    <div className="flex flex-col min-h-screen" style={appStyle}>
      {/* Navbar component handles all navigation logic */}
      <Navbar />
      <Toaster position="top-right" />

      {/* Routes define which component renders for each URL path */}
      <div className="flex-1 pb-16 bg-gray-950">
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
      {!isAdminRoute && <Footer />}
    </div>
  );
}
