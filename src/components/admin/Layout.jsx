import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
