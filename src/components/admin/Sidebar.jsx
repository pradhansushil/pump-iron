import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faClipboardList,
  faImage,
  faIdBadge,
  faCreditCard,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { name: "Dashboard", icon: faHouse, path: "/admin" },
  { name: "Members", icon: faUsers, path: "/admin/members" },
  { name: "Tour Requests", icon: faClipboardList, path: "/admin/tourRequests" },
  { name: "Gallery", icon: faImage, path: "/admin/gallery" },
  { name: "Employees", icon: faIdBadge, path: "/admin/employees" },
  { name: "Payments", icon: faCreditCard, path: "/admin/payments" },
];

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside
      className={[
        "flex flex-col bg-gray-900 h-screen overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
        {isOpen && (
          <span className="text-white font-bold text-lg whitespace-nowrap">
            Gym Admin
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>

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
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
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

      <div className="px-3 py-4 border-t border-gray-700">
        <div
          className={`flex items-center gap-3 px-3 py-2 ${!isOpen && "justify-center"}`}
        >
          <div className="h-8 w-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          {isOpen && (
            <div className="whitespace-nowrap">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">gym@admin.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
