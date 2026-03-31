import { useState } from "react";
import Sidebar from "./Sidebar";
import { pageStyle } from "../../utils/styles";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`flex h-screen ${pageStyle}`}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
