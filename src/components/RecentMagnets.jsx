import { useEffect, useState } from "react";
import {
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { api } from "../api/axios";

export default function RecentMagnets() {
  const [magnets, setMagnets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  const loadMagnets = async (pageNum) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/lead-magnets/recent?page=${pageNum}&limit=${limit}`
      );
      setMagnets(res.data.magnets);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load magnets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagnets(page);
  }, [page]);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <section className="p-6 bg-gray-800 rounded-xl">
      <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <FileText size={20} className="text-teal-400" />
        Recent Lead Magnets
      </h2>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* List + Pagination only when NOT loading */}
      {!loading && (
        <>
          <div className="space-y-4">
            {magnets.length === 0 && (
              <p className="text-gray-400 text-sm">No magnets found.</p>
            )}

            {magnets.map((m) => (
              <div
                key={m.id}
                className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {m.title || "Untitled"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(m.created_at_prompt).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {m.user_name || "Unknown"} ({m.user_email || ""})
                    </p>

                    <span
                      className={`inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs rounded ${
                        m.status === "completed"
                          ? " text-teal-400"
                          : m.status === "pending"
                          ? "bg-yellow/90 text-yellow/70"
                          : "bg-gray-600/30 text-gray-300"
                      }`}
                    >
                      {m.status === "completed" && (
                        <Check className="w-3 h-3 text-teal-400" />
                      )}
                      {m.status}
                    </span>
                  </div>

                  <a
                    href={m.pdf_url || m.original_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-40 flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Prev
            </button>

            <span className="text-gray-300 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-40 flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
