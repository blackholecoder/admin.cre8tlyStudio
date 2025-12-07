import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { User, Mail, Calendar, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ReferralModal from "../components/ReferralModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleGiveFreeSlots = async (userId, email) => {
    setLoadingUserId(userId);
    try {
      await api.post("/admin/give-free-magnets", { userId, count: 1 });
      toast.success(`Gave 1 free slot to ${email}`);
    } catch (err) {
      toast.error("Failed to add free slots");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleGiveFreeBookSlots = async (userId, email) => {
    setLoadingUserId(userId);
    try {
      await api.post("/admin/give-free-books", { userId, count: 1 });
      toast.success(`Gave 1 free book slot to ${email}`);
    } catch (err) {
      toast.error("Failed to add book slots");
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

      const res = await api.post("/admin/create-user-with-slots", {
        ...form,
        slots: 5,
      });

      toast.success(res.data.message || "User created successfully");

      // refresh user list after adding
      const refreshed = await api.get(`/admin/users?page=${page}&limit=20`);
      setUsers(refreshed.data.users);
      setTotalUsers(refreshed.data.total);
      setTotalPages(refreshed.data.totalPages);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    toast.info(
      <div className="text-center">
        <p className="font-medium text-gray-200 mb-2">
          Are you sure you want to permanently delete this user?
        </p>
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await api.delete(`/admin/users/users/${userId}`);

                setUsers((prev) => prev.filter((u) => u.id !== userId));
                toast.success("✅ User deleted successfully");
              } catch (err) {
                console.error("Delete error:", err);
                toast.error(
                  err.response?.data?.message || "❌ Failed to delete user"
                );
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        hideProgressBar: true,
        className: "bg-gray-900 border border-gray-700 shadow-lg",
      }
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/admin/users?page=${page}&limit=20`);

        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotalUsers(res.data.total);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [page]);

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
            {totalUsers} total registered users
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
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleGiveFreeSlots(u.id, u.email)}
                      disabled={loadingUserId === u.id}
                      className={`bg-red-600 hover:bg-headerGreen text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${
                        loadingUserId === u.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                    >
                      {loadingUserId === u.id ? "Processing..." : "Slots"}
                    </button>

                    <button
                      onClick={() => handleGiveFreeBookSlots(u.id, u.email)}
                      disabled={loadingUserId === u.id}
                      className={`bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${
                        loadingUserId === u.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                    >
                      {loadingUserId === u.id ? "Processing..." : "Books"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setShowReferralModal(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200"
                    >
                      Referral
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 bg-gray-800 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all duration-200"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-center gap-3 py-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 rounded-md text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-300 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 rounded-md text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>

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
              <div className="pt-3 flex items-center justify-end gap-2 flex-wrap">
                <button
                  onClick={() => handleGiveFreeSlots(u.id, u.email)}
                  disabled={loadingUserId === u.id}
                  className={`bg-red-600 hover:bg-headerGreen text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${
                    loadingUserId === u.id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }`}
                >
                  {loadingUserId === u.id ? "Processing..." : "5 Slots"}
                </button>

                <button
                  onClick={() => handleGiveFreeBookSlots(u.id, u.email)}
                  disabled={loadingUserId === u.id}
                  className={`bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${
                    loadingUserId === u.id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }`}
                >
                  {loadingUserId === u.id ? "Processing..." : "1 Book"}
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
      {showReferralModal && selectedUser && (
        <ReferralModal
          user={selectedUser}
          onClose={() => setShowReferralModal(false)}
        />
      )}
    </div>
  );
}
