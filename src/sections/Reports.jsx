import { useEffect, useState, Fragment } from "react";
import { api } from "../api/axios";
import {
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  ExternalLink,
  CheckCircle,
  Edit3,
} from "lucide-react";

function stripHTML(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/admin/reports");
        setReports(res.data.reports || []);
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
            {reports.length} users with generated lead magnets
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800 shadow-lg bg-gray-900/60 backdrop-blur">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 uppercase text-xs tracking-wide lead-text">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Purchased</th>
              <th className="px-6 py-4 text-left">Completed</th>
              <th className="px-6 py-4 text-left">Pending</th>
              <th className="px-6 py-4 text-left">Remaining</th>
              <th className="px-6 py-4 text-left">Last Created</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reports.map((user, i) => (
              <Fragment key={user.user_id || i}>
                <tr className="hover:bg-gray-800/70 transition-all duration-200">
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-100 lead-text">
                    <User size={16} className="text-teal-400" />
                    {user.user_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-400 lead-text">
                    {user.user_email}
                  </td>
                  <td className="px-6 py-4">{user.purchased_slots}</td>
                  <td className="px-6 py-4 text-green-400">
                    {user.completed_reports}
                  </td>
                  <td className="px-6 py-4 text-yellow-400">
                    {user.pending_reports}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {Math.max(user.remaining_slots, 0)}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-400 lead-text">
                    <Calendar size={16} className="text-gray-500" />
                    {user.last_created_at
                      ? new Date(user.last_created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        setExpandedUser(
                          expandedUser === user.user_id ? null : user.user_id
                        )
                      }
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      {expandedUser === user.user_id ? (
                        <>
                          <ChevronDown size={16} /> Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronRight size={16} /> View Details
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {/* Expanded lead magnets */}
                {expandedUser === user.user_id && (
                  <tr className="bg-gray-950/70 border-t border-gray-800">
                    <td colSpan={8} className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white lead-text">
                          Lead Magnets ({user.lead_magnets?.length || 0})
                        </h3>

                        {/* Scrollable container */}
                        <div className="max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/40 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                          <table className="min-w-full text-xs text-gray-300">
                            <thead className="bg-gray-800/60 text-gray-400 uppercase text-[11px]">
                              <tr>
                                <th className="px-3 py-2 text-left">Slot</th>
                                <th className="px-3 py-2 text-left">Prompt</th>
                                <th className="px-3 py-2 text-left">Theme</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">
                                  Submission Date
                                </th>
                                <th className="px-3 py-2 text-left">
                                  Edit Used
                                </th>
                                <th className="px-3 py-2 text-left">
                                  Edit Date
                                </th>
                                <th className="px-3 py-2 text-left">PDF</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.lead_magnets?.map((lm) => (
                                <tr
                                  key={lm.id}
                                  className="hover:bg-gray-800/40 transition"
                                >
                                  <td className="px-3 py-2">
                                    {lm.slot_number}
                                  </td>
                                  <td className="px-3 py-2 text-gray-200 truncate max-w-[200px]">
                                    {lm.prompt ? (
                                      <button
                                        onClick={() =>
                                          setSelectedPrompt(
                                            stripHTML(lm.prompt)
                                          )
                                        }
                                        className="text-blue-400 hover:text-blue-300 underline truncate"
                                        title="View full prompt"
                                      >
                                        {stripHTML(lm.prompt).length > 50
                                          ? stripHTML(lm.prompt).slice(0, 50) +
                                            "..."
                                          : stripHTML(lm.prompt)}
                                      </button>
                                    ) : (
                                      <span className="italic text-gray-500">
                                        (no prompt)
                                      </span>
                                    )}
                                  </td>

                                  <td className="px-3 py-2 capitalize">
                                    {lm.theme}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                        lm.status === "completed"
                                          ? "bg-green-700/40 text-green-300"
                                          : lm.status === "pending"
                                          ? "bg-yellow-700/40 text-yellow-300"
                                          : lm.status === "failed"
                                          ? "bg-red-700/40 text-red-300"
                                          : "bg-gray-700/40 text-gray-300"
                                      }`}
                                    >
                                      {lm.status}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-gray-400">
                                    {lm.created_at_prompt
                                      ? new Date(
                                          lm.created_at_prompt
                                        ).toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "2-digit",
                                        })
                                      : "—"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {lm.edit_used ? (
                                      <CheckCircle
                                        size={14}
                                        className="text-green-400"
                                      />
                                    ) : (
                                      <Edit3
                                        size={14}
                                        className="text-gray-500"
                                      />
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-gray-400">
                                    {lm.edit_committed_at
                                      ? new Date(
                                          lm.edit_committed_at
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })
                                      : "—"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {lm.pdf_url ? (
                                      <a
                                        href={lm.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                                      >
                                        <ExternalLink size={14} />
                                        Open
                                      </a>
                                    ) : (
                                      <span className="text-gray-500">N/A</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile version */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {reports.map((user) => (
          <div
            key={user.user_id}
            className="border border-gray-800 bg-gray-900/60 backdrop-blur rounded-xl p-4 space-y-3 shadow-md"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-100">
                <User size={16} className="text-teal-400" />
                <p className="font-medium lead-text">{user.user_name}</p>
              </div>
              <button
                onClick={() =>
                  setExpandedUser(
                    expandedUser === user.user_id ? null : user.user_id
                  )
                }
                className="text-blue-400 text-sm flex items-center gap-1"
              >
                {expandedUser === user.user_id ? (
                  <>
                    <ChevronDown size={14} /> Hide
                  </>
                ) : (
                  <>
                    <ChevronRight size={14} /> View
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs">{user.user_email}</p>
            <p className="text-sm text-gray-300">
              Completed:{" "}
              <span className="text-green-400">{user.completed_reports}</span>
            </p>
            {expandedUser === user.user_id && (
              <div className="pt-2 border-t border-gray-800 mt-2 space-y-2">
                {user.lead_magnets?.map((lm) => (
                  <div
                    key={lm.id}
                    className="bg-gray-800/40 p-3 rounded-lg space-y-1"
                  >
                    <p className="text-xs text-gray-300">
                      <span className="text-gray-400">Prompt:</span>{" "}
                      {lm.prompt || "(none)"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Theme: {lm.theme} | Slot: {lm.slot_number}
                    </p>
                    <p className="text-xs text-gray-400">
                      Status:{" "}
                      <span
                        className={`${
                          lm.status === "completed"
                            ? "text-green-400"
                            : lm.status === "pending"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        {lm.status}
                      </span>
                    </p>
                    {lm.pdf_url && (
                      <a
                        href={lm.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Open PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-white lead-text">
              Full Prompt
            </h2>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {selectedPrompt}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPrompt(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
