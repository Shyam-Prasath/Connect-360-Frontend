// Sidebar.jsx
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Mail,
  Megaphone,
  Upload,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "./DashboardLayout";

export default function Sidebar() {
  const { isExpanded, setIsExpanded } = useSidebar();

  const navigate = useNavigate();

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    navigate("/", { replace: true }); 
  };

  const navItems = [
    { path: "/home", icon: Home, label: "Home", color: "#8B5CF6" }, // violet
    { path: "/upload", icon: Upload, label: "Share Among", color: "#3B82F6" }, // blue
    { path: "/invite", icon: Mail, label: "Invite Connections", color: "#F59E0B" }, // amber
    { path: "/notice", icon: Megaphone, label: "Notice/Post", color: "#EF4444" }, // red
    { path: "/accepted", icon: CheckCircle, label: "My Network", color: "#10B981" }, // green
  ];

  return (
    <div
      className={`fixed right-0 top-0 h-screen transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)",
        borderLeft: "1px solid rgba(139,92,246,0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "-10px 0 25px rgba(139,92,246,0.1)",
        borderTopLeftRadius: "30px",
        borderBottomLeftRadius: "30px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-violet-200/30">
        {isExpanded && (
          <h2 className="text-xl font-bold animate-fade-in bg-gradient-to-r from-violet-800 to-purple-600 bg-clip-text text-transparent">
            Navigation
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-violet-100/50 hover:bg-violet-200/50 transition-all duration-200 border border-violet-200/30"
        >
          {isExpanded ? (
            <ChevronRight className="w-5 h-5 text-violet-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-violet-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4 flex-1">
        {navItems.map(({ path, icon: Icon, label, color }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden hover:bg-white/50 ${
                isExpanded ? "justify-start" : "justify-center"
              } ${
                isActive ? 'bg-white/70 shadow-lg border border-violet-200/50' : ''
              }`
            }
          >
            <Icon
              className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ color }}
            />
            {isExpanded && (
              <span className="font-medium whitespace-nowrap animate-fade-in" style={{ color }}>
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-violet-200/30">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden w-full hover:bg-red-50/50 ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <LogOut
            className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{ color: "#EF4444" }}
          />
          {isExpanded && (
            <span className="font-medium whitespace-nowrap animate-fade-in" style={{ color: "#EF4444" }}>
              Logout
            </span>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}