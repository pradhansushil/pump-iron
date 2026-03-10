import { useLocation, useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };

  return (
    <div className="admin-navbar">
      <button onClick={handleLogout}>Log Out</button>
      <div className="admin-nav-links">
        <Link
          to="/admin"
          className={isActive("/admin") ? "nav-link-active" : "nav-link"}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/members"
          className={
            isActive("/admin/members") ? "nav-link-active" : "nav-link"
          }
        >
          Members
        </Link>
        <Link
          to="/admin/tourRequests"
          className={
            isActive("/admin/tourRequests") ? "nav-link-active" : "nav-link"
          }
        >
          Tour Requests
        </Link>
      </div>
    </div>
  );
}
