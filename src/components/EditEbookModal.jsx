import { useState } from "react";
import { Pencil } from "lucide-react";
import { api } from "../api/axios";
import { toast } from "react-toastify";

export default function EditEbookModal({ ebook, onClose }) {
  const [form, setForm] = useState({
    title: ebook.title,
    description: ebook.description,
    price: ebook.price,
    color: ebook.color,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.put(
        "/ebooks",
        { id: ebook.id, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Ebook updated successfully");
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update ebook");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Pencil size={18} className="text-headerGreen" /> Edit Ebook
        </h2>

        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-headerGreen"
          placeholder="Title"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-headerGreen"
          placeholder="Description"
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-headerGreen"
          placeholder="Price"
        />
        <select
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700"
        >
          <option value="purple">Purple</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 bg-headerGreen text-black font-semibold rounded-lg hover:opacity-90 transition ${
              saving ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
