import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminTopicPosts() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/admin/community/posts-by-topic/${topicId}`);
      const unread = await api.get(`/admin/community/unseen-map/${topicId}`);

      const mapped = (res.data.posts || []).map((p) => ({
        ...p,
        hasNew: unread.data.byPost?.[p.id] > 0,
      }));

      setPosts(mapped);
    }

    load();
  }, [topicId]);

  return (
    <div className="p-6 space-y-4">

      <button
        onClick={() => navigate("/admin/community")}
        className="text-gray-400 hover:text-white"
      >
        ← Back to Topics
      </button>

      <h1 className="text-2xl font-bold text-white">Posts</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() =>
            navigate(`/admin/community/post/${post.id}`)
          }
          className="p-4 bg-gray-900/60 border border-gray-800 cursor-pointer rounded-lg flex justify-between"
        >
          <div>
            <h2 className="text-white font-semibold">{post.title}</h2>
            <p className="text-gray-400 text-sm">{post.author}</p>
          </div>

          {post.hasNew && (
            <span className="text-xs bg-green text-black px-2 py-0.5 rounded-full h-fit">
              NEW
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
