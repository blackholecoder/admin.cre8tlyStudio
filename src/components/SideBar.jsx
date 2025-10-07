import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, FileText, Settings, Menu, X, Mail} from "lucide-react";
import { headerLogo } from "../assets";



const navItems = [
  { name: "Dashboard", to: "/", icon: <Home size={20} /> },
  { name: "Users", to: "/users", icon: <Users size={20} /> },
  { name: "Reports", to: "/reports", icon: <FileText size={20} /> },
  { name: "Leads", to: "/leads", icon: <Mail size={20} /> },
  { name: "Settings", to: "/settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* ======= Desktop Sidebar ======= */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex items-center justify-center h-16 border-b border-gray-800 text-xl tracking-wide lead-text">
          <img
            src={headerLogo}
            alt="Cre8tly Logo"
            className="w-8 h-8 mr-3 object-contain"
          />
          Cre8tlyStudio
        </div>
        <nav className="flex-1 overflow-y-auto py-6 space-y-1 lead-text">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-teal-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ======= Mobile Top Bar ======= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[9999] bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={headerLogo} alt="Cre8tly Logo" className="w-7 h-7" />
          <span className="text-white text-lg lead-text">Cre8tlyStudio</span>
        </div>
        <button
          onClick={toggleMenu}
          className="text-gray-300 hover:text-white transition"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ======= Mobile Drawer ======= */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={toggleMenu}
      >
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-gray-900 border-r border-gray-800 transform transition-all duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <img src={headerLogo} alt="Cre8tly Logo" className="w-7 h-7" />
              <span className="text-white text-lg lead-text">
                Cre8tlyStudio
              </span>
            </div>
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 space-y-1 lead-text">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-800 text-teal-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Spacer for mobile nav height */}
      <div className="h-14 md:hidden" />
    </>
  );
}
