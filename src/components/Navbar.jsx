// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // eslint-disable-next-line no-unused-vars
  const [notificationCount, setNotificationCount] = useState(3);

  // Get authentication state and functions
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reference to dropdown element for outside click detection
  const dropdownRef = useRef(null);

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Check if current route matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
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

  return (
    <nav>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          GymApp
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link
            to="/"
            className={isActive("/") ? "nav-link active" : "nav-link"}
          >
            Home
          </Link>

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
                to="/pricing"
                className={
                  isActive("/pricing") ? "nav-link active" : "nav-link"
                }
              >
                Pricing
              </Link>

              <Link
                to="/about"
                className={isActive("/about") ? "nav-link active" : "nav-link"}
              >
                About
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

              <Link
                to="/bookings"
                className={
                  isActive("/bookings") ? "nav-link active" : "nav-link"
                }
              >
                My Bookings
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

              {/* Avatar Dropdown */}
              <div className="avatar-dropdown" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="avatar-button"
                  aria-expanded={isDropdownOpen}
                  aria-label="User menu"
                >
                  {currentUser.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : currentUser.email.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
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
