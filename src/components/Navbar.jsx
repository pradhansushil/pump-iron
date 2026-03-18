import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import NavLinks from "./navbar/NavLinks";
import AvatarDropdown from "./navbar/AvatarDropdown";

export default function Navbar() {
  const [notificationCount, setNotificationCount] = useState(3); // eslint-disable-line no-unused-vars
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentUser, logout, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) => {
    if (isActive(path))
      return "text-blue-400 font-bold border-b-2 border-blue-400";
    return "text-gray-300 hover:text-white transition-colors duration-200";
  };

  if (location.pathname.startsWith("/admin")) return null;
  if (loading) return null;
  if (userRole === "admin") return null;

  const navBg = isHomePage && !isScrolled ? "" : "bg-gray-900";

  return (
    <nav
      aria-label="main navigation"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4">
        <Link
          to="/"
          aria-hidden="true"
          tabIndex={-1}
          className="font-bold uppercase tracking-widest text-white"
        >
          Pump &amp; Iron
        </Link>

        <NavLinks
          currentUser={currentUser}
          linkClasses={linkClasses}
          notificationCount={notificationCount}
          onNotificationClick={() => toast("Notifications coming soon!")}
          onAvatarSection={
            currentUser && (
              <AvatarDropdown
                currentUser={currentUser}
                isDropdownOpen={isDropdownOpen}
                toggleDropdown={toggleDropdown}
                handleLogout={handleLogout}
                setIsDropdownOpen={setIsDropdownOpen}
                dropdownRef={dropdownRef}
              />
            )
          }
        />
      </div>
    </nav>
  );
}
