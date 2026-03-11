import AdminNavbar from "./Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      {children}
    </div>
  );
}
