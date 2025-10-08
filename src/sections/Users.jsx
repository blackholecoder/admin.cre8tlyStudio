import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { User, Mail, Calendar } from "lucide-react";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGiveFreeSlots = async (userId, email) => {
    setLoadingUserId(userId);
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        "/admin/give-free-magnets",
        { userId, count: 5 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Gave 5 free slots to ${email}`);
    } catch (err) {
      toast.error("Failed to add free slots");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await api.post(
        "/admin/create-user-with-slots",
        { ...form, slots: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "User created successfully");

      // refresh user list after adding
      const refreshed = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(refreshed.data.users);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-lg font-semibold text-white mb-4 lead-text">
              Add New User
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Temporary Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleCreateUser}
              disabled={loading}
              className={`bg-red-600 hover:bg-headerGreen text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? "Creating User..." : "Create User + 5 Free Slots"}
            </button>
          </div>

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
              <th className="px-6 py-4 text-left w-1/6">Actions</th>
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
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleGiveFreeSlots(u.id, u.email)}
                    disabled={loadingUserId === u.id}
                    className={`bg-red-600 hover:bg-headerGreen text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-colors duration-200 ${
                      loadingUserId === u.id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                  >
                    {loadingUserId === u.id ? "Processing..." : "+5 Free Slots"}
                  </button>
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
              <div className="pt-3">
                <button
                  onClick={() => handleGiveFreeSlots(u.id, u.email)}
                  disabled={loadingUserId === u.id}
                  className={`bg-red-600 hover:bg-headerGreen text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-colors duration-200 ${
                    loadingUserId === u.id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }`}
                >
                  {loadingUserId === u.id ? "Processing..." : "+5 Free Slots"}
                </button>
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
