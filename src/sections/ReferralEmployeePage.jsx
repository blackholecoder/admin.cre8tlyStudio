import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { User, Mail, Calendar, Rocket } from "lucide-react";

export default function ReferralEmployeePage() {
  const [referrals, setReferrals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const loadReferrals = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/admin/referral/referrals?page=${page}&limit=20${
          employeeFilter ? `&employeeId=${employeeFilter}` : ""
        }`
      );

      setReferrals(res.data.referrals || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Referral fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await api.get("/admin/referral/employees");
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Employee list load error:", err);
      }
    };

    loadEmployees();
  }, []);

  useEffect(() => {
    loadReferrals();
  }, [page, employeeFilter]);

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">
        Employee Referrals
      </h1>
      <p className="text-gray-400 text-sm sm:text-base">
        Track all employee referral activity
      </p>

      {/* Filter */}
      <div className="bg-gray-900 p-4 border border-gray-800 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">
          Filter By Employee ID
        </h2>

        <select
          value={employeeFilter}
          onChange={(e) => {
            setEmployeeFilter(e.target.value);
            setPage(1);
          }}
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
        >
          <option value="">All Employees</option>

          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} — {emp.email}
            </option>
          ))}
        </select>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 shadow-lg">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : referrals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No referrals found</p>
        ) : (
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-left">Referred Email</th>
                <th className="px-6 py-4 text-left">Referred User</th>
                <th className="px-6 py-4 text-left">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-800/40">
                  <td className="px-6 py-4 text-white">
                    <User size={14} className="inline mr-2 text-teal-400" />
                    {ref.employee_name || "Unknown"}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    <Mail size={14} className="inline mr-2 text-gray-500" />
                    {ref.referred_email}
                  </td>

                  <td className="px-6 py-4">
                    {ref.referred_user_id ? (
                      <div className="flex items-center gap-2 text-green-400 font-semibold">
                        <Rocket size={16} className="text-green-400" />
                        <span>{ref.referred_user_name || "User"}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not signed up yet</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    <Calendar size={14} className="inline mr-2 text-gray-500" />
                    {new Date(ref.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : referrals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No referrals found</p>
        ) : (
          referrals.map((ref) => (
            <div
              key={ref.id}
              className="border border-gray-800 bg-gray-900/60 backdrop-blur rounded-xl p-4 space-y-3 shadow-md hover:bg-gray-800/70 transition-all"
            >
              {/* Employee */}
              <div className="flex items-center gap-2 text-gray-100">
                <User size={16} className="text-teal-400" />
                <span className="font-medium">
                  {ref.employee_name || "Unknown"}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-gray-300 text-sm break-all">
                <Mail size={14} className="text-gray-500" />
                {ref.referred_email}
              </div>

              {/* Referred User */}
              <div className="text-sm">
                {ref.referred_user_id ? (
                  <div className="flex items-center gap-2">
                    <Rocket size={16} className="text-green-400" />
                    <span className="text-green-400 font-semibold">
                      {ref.referred_user_name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Rocket size={16} className="text-gray-500" />
                    <span>Not signed up yet</span>
                  </div>
                )}
              </div>

              {/* Created */}
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Calendar size={14} />
                {new Date(ref.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 rounded-lg text-white disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-300">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-800 rounded-lg text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
