import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faClipboardList,
  faImage,
  faIdBadge,
  faCreditCard,
  faChevronLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { name: "Dashboard", icon: faHouse, path: "/admin" },
  { name: "Members", icon: faUsers, path: "/admin/members" },
  { name: "Tour Requests", icon: faClipboardList, path: "/admin/tourRequests" },
  { name: "Gallery", icon: faImage, path: "/admin/gallery" },
  { name: "Employees", icon: faIdBadge, path: "/admin/employees" },
  { name: "Payments", icon: faCreditCard, path: "/admin/payments" },
];

export default function Sidebar({ isOpen, onToggle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <aside
      className={[
        "flex flex-col bg-slate-800 h-screen overflow-hidden transition-all duration-300 ease-in-out border-r border-slate-700",
        isOpen ? "w-64" : "w-16",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center h-16 border-b border-slate-700 px-4">
        {isOpen && (
          <span className="flex-1 text-white font-bold text-lg whitespace-nowrap">
            Gym Admin
          </span>
        )}
        <button
          onClick={onToggle}
          className={[
            "p-1.5 rounded-lg text-gray-400 hover:bg-slate-700 hover:text-white transition-colors",
            !isOpen && "w-full flex justify-center",
          ].join(" ")}
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-slate-700 hover:text-white",
                !isOpen && "justify-center",
              ].join(" ")
            }
          >
            <FontAwesomeIcon icon={item.icon} className="w-5 h-5 shrink-0" />
            {isOpen && (
              <span className="whitespace-nowrap text-sm font-medium">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="px-3 py-4 border-t border-slate-700 relative">
        {/* Logout dropdown */}
        {isProfileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        )}

        {/* Clickable admin badge */}
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={[
            "flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-slate-700 transition-colors",
            !isOpen && "justify-center",
          ].join(" ")}
        >
          <div className="h-8 w-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          {isOpen && (
            <div className="whitespace-nowrap text-left">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">gym@admin.com</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
