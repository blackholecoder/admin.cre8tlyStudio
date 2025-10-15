import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import EditEbookModal from "./EditEbookModal";

export default function EbookList({ ebooks = [], onDelete, deletingId }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editingEbook, setEditingEbook] = useState(null);

  if (!ebooks.length) {
    return (
      <div className="text-center text-gray-400 py-10 text-sm lead-text">
        No ebooks found.
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight lead-text">
        Ebook Library
      </h1>
      <p className="text-gray-400 text-sm mt-1 mb-6 lead-text">
        {ebooks.length} total ebooks
      </p>

      {/* ===== MOBILE FIRST STACK VIEW ===== */}
      <div className="grid grid-cols-1 gap-5 md:hidden">
        {ebooks.map((b) => (
          <div
            key={b.id}
            className="border border-gray-800 bg-gray-900/60 rounded-2xl shadow-md p-4 space-y-3 hover:bg-gray-800/70 transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src={b.image_url}
                alt={b.title}
                className="w-20 h-28 object-cover rounded-lg border border-gray-700"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {b.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">{b.description}</p>
                <p className="text-green-400 font-semibold text-base">
                  ${b.price}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-800 pt-3 text-xs text-gray-400">
              <span className="capitalize">{b.color}</span>
              <span className="text-gray-500">{b.product_type}</span>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-500" />
                {new Date(b.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingEbook(b)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(b.id)}
                disabled={deletingId === b.id}
                className={`bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${
                  deletingId === b.id
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {deletingId === b.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DESKTOP TABLE VIEW ===== */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800 shadow-lg bg-gray-900/60 backdrop-blur">
        <table className="min-w-full text-sm text-gray-300 table-fixed">
          <thead className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 uppercase text-xs tracking-wide lead-text">
            <tr>
              <th className="px-6 py-4 text-left w-[10%]">Cover</th>
              <th className="px-6 py-4 text-left w-[25%]">Title</th>
              <th className="px-6 py-4 text-left w-[10%]">Price</th>
              <th className="px-6 py-4 text-left w-[10%]">Color</th>
              <th className="px-6 py-4 text-left w-[15%]">Product Slug</th>
              <th className="px-6 py-4 text-left w-[10%]">Created</th>
              <th className="px-6 py-4 text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {ebooks.map((b) => {
              const isOpen = expandedId === b.id;
              return (
                <React.Fragment key={b.id}>
                  <tr
                    className="hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
                    onClick={() => toggleExpand(b.id)}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={b.image_url}
                        alt={b.title}
                        className="w-16 h-20 object-cover rounded-md border border-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-100">{b.title}</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">
                      ${b.price}
                    </td>
                    <td className="px-6 py-4 text-gray-400 capitalize">
                      {b.color}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {b.product_type}
                    </td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEbook(b);
                        }}
                        className="bg-blue hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(b.id);
                        }}
                        disabled={deletingId === b.id}
                        className={`bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200 ${
                          deletingId === b.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105"
                        }`}
                      >
                        {deletingId === b.id ? "Deleting..." : "Delete"}
                      </button>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-gray-400 ml-2" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400 ml-2" />
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="7" className="p-0">
                      <div
                        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden bg-gray-800/60 ${
                          isOpen ? "max-h-96 p-6" : "max-h-0 p-0"
                        }`}
                      >
                        <div
                          className={`transition-opacity duration-300 ${
                            isOpen ? "opacity-100 delay-150" : "opacity-0"
                          }`}
                        >
                          <p className="text-sm text-gray-300 mb-3">
                            <strong>Description:</strong>{" "}
                            {b.description || "No description"}
                          </p>
                          <p className="text-sm text-gray-400 mb-1">
                            <strong>Color:</strong> {b.color}
                          </p>
                          <p className="text-sm text-gray-400">
                            <strong>Product Slug:</strong> {b.product_type}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editingEbook && (
        <EditEbookModal
          ebook={editingEbook}
          onClose={() => setEditingEbook(null)}
        />
      )}
    </div>
  );
}
