import { useRef } from "react";
import { Link } from "react-router-dom";

export default function AvatarDropdown({
  currentUser,
  isDropdownOpen,
  toggleDropdown,
  handleLogout,
  setIsDropdownOpen,
  dropdownRef,
}) {
  const avatarButtonRef = useRef(null);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={avatarButtonRef}
        onClick={toggleDropdown}
        className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
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
          className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50"
          id="user-dropdown-menu"
          role="menu"
        >
          <Link
            role="menuitem"
            to="dashboard/profile"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            Profile
          </Link>
          <button
            role="menuitem"
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
