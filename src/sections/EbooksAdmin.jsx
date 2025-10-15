import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { BookOpenText, Image as ImageIcon } from "lucide-react";
import EbookList from "../components/eBookList";

export default function EbooksAdmin() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    color: "purple",
    imageBase64: "",
    productType: "",
  });

  // 🔹 Fetch all ebooks
  const fetchEbooks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/ebooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEbooks(res.data);
    } catch (err) {
      console.error("Failed to fetch ebooks:", err);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  // 🔹 Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, imageBase64: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Create new ebook
  const handleCreateEbook = async () => {
    if (!form.title || !form.price || !form.imageBase64 || !form.productType) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.post("/ebooks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Ebook created successfully");
      setForm({
        title: "",
        description: "",
        price: "",
        color: "purple",
        imageBase64: "",
        productType: "",
      });
      setPreview(null);
      fetchEbooks();
    } catch (err) {
      toast.error("Failed to create ebook");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete ebook
  const handleDelete = async (ebookId) => {
    if (!window.confirm("Delete this ebook?")) return;
    setDeletingId(ebookId);

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete("/ebooks", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ebookId },
      });
      toast.success("Ebook deleted successfully");
      fetchEbooks();
    } catch (err) {
      toast.error("Failed to delete ebook");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* ====== Create Ebook Form ====== */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 mb-8 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4 lead-text flex items-center gap-2">
          <BookOpenText size={18} className="text-headerGreen" /> Add New Ebook
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="text"
            placeholder="Product Slug (unique) *"
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value })}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price *"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700"
          >
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mt-2 p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        {/* 🔹 Image upload section */}
        <div className="mt-6">
          <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
            <ImageIcon size={16} /> Upload Cover Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-gray-400 border border-gray-700 rounded-lg bg-gray-800 p-3"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-32 h-44 object-cover rounded-lg border border-gray-700 shadow-md"
            />
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCreateEbook}
            disabled={loading}
            className={`bg-royalPurple hover:bg-headerGreen text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Creating..." : "Add Ebook"}
          </button>
        </div>
      </div>

      <EbookList
        ebooks={ebooks}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* The table and mobile view remain unchanged */}
      {/* (your previous responsive table + mobile grid code stays exactly the same) */}
    </div>
  );
}
