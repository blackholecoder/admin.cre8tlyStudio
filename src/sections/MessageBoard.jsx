import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import { Plus, Trash2, Calendar,  ChevronDown } from "lucide-react";
import { toast } from "react-toastify"; // ✅ import toastify
import "react-toastify/dist/ReactToastify.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openMessageId, setOpenMessageId] = useState(null);
  const loaderRef = useRef(null);

  function toggleMessage(id) {
  setOpenMessageId((prev) => (prev === id ? null : id));
  }


  useEffect(() => {
    fetchMessages(0, true);
  }, []);

  // 🧠 Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchMessages(page + 1);
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [page, hasMore, loading]);

  async function fetchMessages(pageNum = 0, reset = false) {
    try {
      setLoading(true);
      const res = await api.get(`/admin/messages?offset=${pageNum * 20}&limit=20`);
      const newData = res.data || [];

      if (reset) {
        setMessages(newData);
      } else {
        setMessages((prev) => [...prev, ...newData]);
      }

      setHasMore(newData.length === 20);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load messages", err);
      toast.error("❌ Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.warning("Please fill out both title and message");
      return;
    }

    try {
      await api.post("/admin/messages", { title, message });
      toast.success("✅ Message posted successfully!");
      setTitle("");
      setMessage("");
      fetchMessages(0, true);
    } catch (err) {
      console.error("Failed to post message", err);
      toast.error("❌ Failed to post message");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/admin/messages/${id}`);
      toast.info("🗑️ Message deleted");
      fetchMessages(0, true);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete message");
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Messages</h1>

      {/* ✏️ Create Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/70 p-4 rounded-xl border border-gray-800 shadow"
      >
        <input
          type="text"
          placeholder="Message title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green outline-none"
        />
        <textarea
          placeholder="Write your update or announcement..."
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-green text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition w-full sm:w-auto"
        >
          <Plus size={16} /> Post Message
        </button>
      </form>

      {/* 💬 Messages */}
      <div className="grid grid-cols-1 gap-4">
        {messages.map((m) => {
  const isOpen = openMessageId === m.id;

  return (
    <div
      key={m.id}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 shadow-md"
    >
      {/* Header Row */}
      <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMessage(m.id)}>
        <h2 className="text-white font-semibold text-base">{m.title}</h2>

        <div className="flex items-center gap-3">
          {/* Rotate arrow */}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(m.id);
            }}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-400 text-sm whitespace-pre-line leading-relaxed">
          {m.message}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
          <Calendar size={12} />
          {new Date(m.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
})}

      </div>

      {loading && (
        <div className="text-center text-gray-400 py-4">Loading...</div>
      )}
      <div ref={loaderRef} className="h-6"></div>
    </div>
  );
}
