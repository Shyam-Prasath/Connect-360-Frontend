// DashboardLayout.jsx
import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

// Create context for sidebar state
const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

export default function DashboardLayout() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Main content */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isExpanded ? 'mr-64' : 'mr-16'
          }`}
          style={{ padding: "0" }}
        >
          <Outlet />
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </SidebarContext.Provider>
  );
}
