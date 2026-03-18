import { Link } from "react-router-dom";

export default function NavLinks({
  currentUser,
  linkClasses,
  notificationCount,
  onNotificationClick,
  onAvatarSection,
}) {
  return (
    <div className="hidden md:flex items-center gap-6">
      {!currentUser && (
        <Link to="/" className={linkClasses("/")}>
          Home
        </Link>
      )}

      <Link to="/classes" className={linkClasses("/classes")}>
        Classes
      </Link>

      {!currentUser ? (
        <>
          <Link to="/employees" className={linkClasses("/employees")}>
            Employees
          </Link>

          <Link to="/gallery" className={linkClasses("/gallery")}>
            Gallery
          </Link>

          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Login
          </Link>
        </>
      ) : (
        <>
          <Link to="/dashboard" className={linkClasses("/dashboard")}>
            Dashboard
          </Link>

          <button
            aria-label={
              notificationCount > 0
                ? `View ${notificationCount} notifications`
                : "View notifications"
            }
            onClick={onNotificationClick}
            className="relative text-gray-300 hover:text-white transition-colors duration-200"
          >
            🔔
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4">
                {notificationCount}
              </span>
            )}
          </button>

          {onAvatarSection}
        </>
      )}
    </div>
  );
}
