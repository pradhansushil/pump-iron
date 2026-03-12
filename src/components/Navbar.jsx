import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // eslint-disable-next-line no-unused-vars
  const [notificationCount, setNotificationCount] = useState(3);

  const { currentUser, logout, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        avatarButtonRef.current?.focus();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDropdownOpen]);

  if (location.pathname.startsWith("/admin")) return null;
  if (loading) return null;
  if (userRole === "admin") return null;

  return (
    <nav aria-label="main navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          GymApp
        </Link>

        <div className="nav-links">
          {!currentUser && (
            <Link
              to="/"
              className={isActive("/") ? "nav-link active" : "nav-link"}
            >
              Home
            </Link>
          )}

          <Link
            to="/classes"
            className={isActive("/classes") ? "nav-link active" : "nav-link"}
          >
            Classes
          </Link>

          {!currentUser ? (
            // ========== GUEST NAVIGATION ==========
            <>
              <Link
                to="/employees"
                className={
                  isActive("/employees") ? "nav-link active" : "nav-link"
                }
              >
                Employees
              </Link>

              <Link
                to="/gallery"
                className={
                  isActive("/gallery") ? "nav-link active" : "nav-link"
                }
              >
                Gallery
              </Link>

              <Link to="/login" className="login-button">
                Login
              </Link>
            </>
          ) : (
            // ========== MEMBER NAVIGATION ==========
            <>
              <Link
                to="/dashboard"
                className={
                  isActive("/dashboard") ? "nav-link active" : "nav-link"
                }
              >
                Dashboard
              </Link>

              <button
                aria-label={
                  notificationCount > 0
                    ? `View ${notificationCount} notifications`
                    : "View notifications"
                }
                onClick={() => toast("Notifications coming soon!")}
              >
                🔔
                {notificationCount > 0 && <span>{notificationCount}</span>}
              </button>

              <div className="avatar-dropdown" ref={dropdownRef}>
                <button
                  ref={avatarButtonRef}
                  onClick={toggleDropdown}
                  className="avatar-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-controls="user-dropdown-menu"
                  aria-label="user menu"
                >
                  {currentUser.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : currentUser.email.charAt(0).toUpperCase()}
                </button>

                {isDropdownOpen && (
                  <div
                    className="dropdown-menu"
                    id="user-dropdown-menu"
                    role="menu"
                  >
                    <Link
                      role="menuitem"
                      to="dashboard/profile"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      role="menuitem"
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="dropdown-item logout-button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
