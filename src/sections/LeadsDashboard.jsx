import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Mail, Globe, Calendar, Download } from "lucide-react";
import { toast } from "react-toastify";

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/admin/leads");
        setLeads(res.data.leads);
        console.log("🔹 Leads response:", res.data);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      }
    };
    fetchLeads();
  }, []);

  const handleDownloadCSV = () => {
    if (!leads.length) return toast.info("No leads to export");

    // CSV header
    const headers = ["Email", "Source", "Captured"];

    // Rows
    const rows = leads.map((lead) => [
      lead.email,
      lead.source || "Direct",
      new Date(lead.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    ]);

    // Combine header + rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `captured_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV file downloaded!");
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight lead-text">
            Captured Leads
          </h1>
          <p className="text-gray-400 text-sm mt-1 lead-text">
            {leads.length} total leads captured
          </p>
        </div>
        {/* ✅ Download CSV Button */}
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow transition"
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* ======= Desktop Table (straight columns) ======= */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-800 shadow-lg bg-gray-900/60 backdrop-blur">
        <table className="min-w-full text-sm text-gray-300 table-fixed">
          <thead className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 uppercase text-xs tracking-wide lead-text">
            <tr>
              <th className="px-6 py-4 text-left w-1/2">Email</th>
              <th className="px-6 py-4 text-left w-1/4">Source</th>
              <th className="px-6 py-4 text-left w-1/4">Captured</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {leads.map((lead, i) => (
              <tr
                key={lead.id || i}
                className="hover:bg-gray-800/70 transition-all duration-200"
              >
                <td className="px-6 py-4 text-gray-100 truncate lead-text">
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:text-teal-400 transition"
                  >
                    <Mail
                      size={14}
                      className="inline-block mr-2 text-teal-400 -mt-[2px]"
                    />
                    {lead.email}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-400 capitalize truncate lead-text">
                  <Globe
                    size={14}
                    className="inline-block mr-2 text-gray-500 -mt-[2px]"
                  />
                  {lead.source || "Direct"}
                </td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap lead-text">
                  <Calendar
                    size={14}
                    className="inline-block mr-2 text-gray-500 -mt-[2px]"
                  />
                  {new Date(lead.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm lead-text">
            No leads captured yet.
          </div>
        )}
      </div>

      {/* ======= Mobile Cards ======= */}
      <div className="md:hidden divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900/60 shadow-lg">
        {leads.map((lead, i) => (
          <div
            key={lead.id || i}
            className="p-4 hover:bg-gray-800/70 transition-all duration-200"
          >
            <div className="flex items-center gap-2 text-gray-100 lead-text">
              <Mail size={16} />
              <a
                href={`mailto:${lead.email}`}
                className="hover:text-teal-400 break-all"
              >
                {lead.email}
              </a>
            </div>
            <div className="mt-2 flex items-center gap-2 text-gray-400 text-sm capitalize lead-text">
              <Globe size={14} />
              {lead.source || "Direct"}
            </div>
            <div className="mt-1 flex items-center gap-2 text-gray-500 text-xs lead-text">
              <Calendar size={14} />
              {new Date(lead.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm lead-text">
            No leads captured yet.
          </div>
        )}
      </div>
    </div>
  );
}
