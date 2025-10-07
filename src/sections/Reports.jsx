import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { User, Calendar, FileText } from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      console.log("Token being sent:", localStorage.getItem("accessToken"));
const res = await api.get("/admin/reports");

      try {
        
        const res = await api.get("/admin/reports");
        setReports(res.data.reports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight lead-text">
            Lead Magnet Reports
          </h1>
          <p className="text-gray-400 text-sm mt-1 lead-text">
            {reports.length} total reports
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800 shadow-lg bg-gray-900/60 backdrop-blur">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 uppercase text-xs tracking-wide lead-text">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Theme</th>
              <th className="px-6 py-4 text-left">Slot</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reports.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-gray-800/70 transition-all duration-200">
                <td className="px-6 py-4 flex items-center gap-2 text-gray-100 lead-text">
                  <User size={16} className="text-teal-400" />
                  {r.user_name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-gray-400 lead-text">{r.user_email}</td>
                <td className="px-6 py-4 capitalize">{r.theme}</td>
                <td className="px-6 py-4 lead-text">{r.slot_number}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold lead-text ${
                      r.status === "completed"
                        ? "bg-headerGreen text-white border border-green-600/40"
                        : r.status === "pending"
                        ? "bg-yellow text-black border border-yellow-600/40"
                        : r.status === "failed"
                        ? "bg-red-700/40 text-red-300 border border-red-600/40"
                        : "bg-gray-700/40 text-gray-300 border border-gray-600/40"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-2 text-gray-400 lead-text">
                  <Calendar size={16} className="text-gray-500" />
                  {new Date(r.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked list */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {reports.map((r, i) => (
          <div key={r.id || i} className="border border-gray-800 bg-gray-900/60 backdrop-blur rounded-xl p-4 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-gray-100">
              <FileText size={16} className="text-teal-400" />
              <p className="font-medium lead-text">{r.user_name || "Unknown"}</p>
            </div>
            <p className="text-gray-400 text-sm lead-text">{r.user_email}</p>
            <p className="text-sm text-gray-300 lead-text">Theme: {r.theme}</p>
            <p className="text-sm text-gray-300 lead-text">Slot: {r.slot_number}</p>
            <p className="text-sm capitalize lead-text">
              Status:{" "}
              <span
                className={`${
                  r.status === "completed"
                    ? "text-green-400"
                    : r.status === "pending"
                    ? "text-yellow-400"
                    : r.status === "failed"
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {r.status}
              </span>
            </p>
            <p className="text-xs text-gray-500 lead-text">
              Created: {new Date(r.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
