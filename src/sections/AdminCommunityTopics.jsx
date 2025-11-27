import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminCommunityTopics() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await api.get("/admin/community/topics");
      const unseen = await api.get("/admin/community/unseen-count/by-topic");

      const mapped = res.data.topics.map((t) => ({
        ...t,
        hasNew: unseen.data.byTopic?.[t.id] > 0,
      }));

      setTopics(mapped);
    }

    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">Community Topics</h1>

      {topics.map((t) => (
        <div
          key={t.id}
          className="bg-gray-900/60 border border-gray-800 cursor-pointer
                     rounded-xl p-4 flex justify-between"
          onClick={() => navigate(`/admin/community/topic/${t.id}`)}
        >
          <div className="text-white">{t.name}</div>

          {t.hasNew && (
            <span className="text-xs bg-green text-black px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
