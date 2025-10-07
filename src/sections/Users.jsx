import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { User, Mail, Calendar } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sorted = [...res.data.users].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setUsers(sorted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight lead-text">
            User Directory
          </h1>
          <p className="text-gray-400 text-sm mt-1 lead-text">
            {users.length} total registered users
          </p>
        </div>
      </div>

      {/* ======= Desktop Table (Straight Columns) ======= */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800 shadow-lg bg-gray-900/60 backdrop-blur">
        <table className="min-w-full text-sm text-gray-300 table-fixed">
          <thead className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 uppercase text-xs tracking-wide lead-text">
            <tr>
              <th className="px-6 py-4 text-left w-1/4">Name</th>
              <th className="px-6 py-4 text-left w-1/3">Email</th>
              <th className="px-6 py-4 text-left w-1/6">Role</th>
              <th className="px-6 py-4 text-left w-1/4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((u, i) => (
              <tr
                key={u.id || i}
                className="hover:bg-gray-800/70 transition-all duration-200"
              >
                <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                  <User
                    size={14}
                    className="inline-block mr-2 text-teal-400 -mt-[2px] lead-text"
                  />
                  {u.name}
                </td>
                <td className="px-6 py-4 text-gray-400 truncate">
                  <Mail
                    size={14}
                    className="inline-block mr-2 text-gray-500 -mt-[2px] lead-text"
                  />
                  {u.email}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-purple-700/40 text-purple-300 border border-purple-600/40"
                        : "bg-downloadGreen text-gray-300 border border-gray-600/40 lead-text"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  <Calendar
                    size={14}
                    className="inline-block mr-2 text-gray-500 -mt-[2px] lead-text"
                  />
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm lead-text">
            No users found.
          </div>
        )}
      </div>

      {/* ======= Mobile Stack Layout ======= */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {users.map((u, i) => (
          <div
            key={u.id || i}
            className="border border-gray-800 bg-gray-900/60 backdrop-blur rounded-xl p-4 space-y-2 shadow-md hover:bg-gray-800/70 transition-all"
          >
            <div className="flex items-center gap-2 text-gray-100">
              <User size={16} className="text-teal-400" />
              <span className="font-medium lead-text">{u.name}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm break-all lead-text">
              <Mail size={14} className="text-gray-500" />
              {u.email}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-800">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold lead-text ${
                  u.role === "admin"
                    ? "bg-purple-700/40 text-purple-300 border border-purple-600/40"
                    : "bg-downloadGreen text-gray-300 border border-gray-600/40"
                }`}
              >
                {u.role}
              </span>
              

              <div className="flex items-center gap-1 text-gray-500 lead-text">
                <Calendar size={14} />
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm lead-text">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
