import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminCreatePostModal() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    const res = await api.get("/admin/community/topics");
    setTopics(res.data.topics || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!topicId || !title.trim() || !body.trim()) {
      toast.warning("Please fill out all fields");
      return;
    }

    try {
      await api.post("/admin/community/post", {
        topic_id: topicId,
        title,
        body,
      });

      toast.success("Post created!");

      // Redirect after success
      navigate("/admin/community");

    } catch (err) {
      toast.error("Failed to create post");
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/40 backdrop-blur-md
        flex justify-center items-center
        p-4
      "
    >
      <div
        className="
          bg-gray-900/60 border border-gray-800
          rounded-xl p-6 shadow-lg
          w-full max-w-2xl space-y-6
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-white font-bold">Create Community Post</h2>

          {/* ❗ NEW FIX: Close navigates back */}
          <button onClick={() => navigate("/admin/community")}>
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          >
            <option value="">Select a topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <textarea
            rows={6}
            placeholder="Post description"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-green text-black py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
