import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function MobileMenu({
  isOpen,
  onClose,
  currentUser,
  linkClasses,
  handleLogout,
}) {
  const location = useLocation();

  useEffect(() => {
    onClose(false);
  }, [location.pathname]);

  return (
    <>
      <button
        aria-label={!isOpen ? "open menu" : "close menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => onClose(!isOpen)}
        className="md:hidden text-gray-300 hover:text-white"
      >
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </button>

      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 left-0 w-full bg-gray-900 border-t border-gray-700 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 py-6 gap-6">
          {!currentUser && (
            <Link
              to="/"
              className={linkClasses("/")}
              onClick={() => onClose(false)}
            >
              Home
            </Link>
          )}

          <Link
            to="/classes"
            className={linkClasses("/classes")}
            onClick={() => onClose(false)}
          >
            Classes
          </Link>

          {!currentUser ? (
            <>
              <Link
                to="/employees"
                className={linkClasses("/employees")}
                onClick={() => onClose(false)}
              >
                Employees
              </Link>

              <Link
                to="/gallery"
                className={linkClasses("/gallery")}
                onClick={() => onClose(false)}
              >
                Gallery
              </Link>

              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-center"
                onClick={() => onClose(false)}
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={linkClasses("/dashboard")}
                onClick={() => onClose(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/dashboard/profile"
                className={linkClasses("/dashboard/profile")}
                onClick={() => onClose(false)}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-gray-300 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
