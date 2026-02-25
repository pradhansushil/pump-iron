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
    <div>
      <button onClick={handleLogout}>Log Out</button>
      <div>
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
      </div>
    </div>
  );
}
