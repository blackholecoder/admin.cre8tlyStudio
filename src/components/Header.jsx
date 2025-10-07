import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings, UserCircle } from "lucide-react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch admin info for image + name
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-800 bg-gray-900 sticky top-14 md:top-0 z-20">

      <h1 className="text-lg font-semibold text-gray-100 lead-text">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* 🔔 Notifications */}
        <button className="relative group">
          <Bell
            size={22}
            className="text-gray-400 group-hover:text-teal-400 transition"
          />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-teal-500 rounded-full" />
        </button>

        {/* 👤 Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-md transition"
          >
            {admin?.profile_image ? (
              <img
                src={admin.profile_image}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <UserCircle size={24} className="text-gray-300" />
            )}
            <span className="text-sm text-gray-300">
              {admin?.name || "Admin"}
            </span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-2 sm:right-0 mt-2 w-40 sm:w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1 z-[9999]"
              style={{
                position: "absolute",
                top: "100%",
              }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
              >
                <Settings size={14} className="mr-2 text-gray-400" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
              >
                <LogOut size={14} className="mr-2 text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
