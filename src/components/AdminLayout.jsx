import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
