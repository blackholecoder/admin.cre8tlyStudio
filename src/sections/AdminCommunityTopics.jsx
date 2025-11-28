import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { headerLogo } from "../assets";

export default function AdminCommunityTopics() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/admin/community/topics");
      const unseen = await api.get("/admin/community/unseen-count/by-topic");

      const mapped = res.data.topics.map((t) => ({
        ...t,
        hasNew: unseen.data.byTopic?.[t.id] > 0,
      }));

      setTopics(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load topics");
    }
  }

  return (
    <div className="w-full flex justify-center items-start min-h-screen px-6 py-20">
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-10 backdrop-blur-sm shadow-xl space-y-10 w-full max-w-6xl">
      <div className="flex justify-center">
          <img src={headerLogo} alt="Cre8tly" className="w-16 h-16 mb-4 opacity-80" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">Community Topics</h1>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((t) => {
            const noPosts = t.post_count === 0;

            return (
              <button
                key={t.id}
                disabled={noPosts}
                onClick={() =>
                  !noPosts && navigate(`/admin/community/topic/${t.id}`)
                }
                className={`relative text-left bg-gray-900/80 p-6 rounded-xl border border-gray-700 transition-all
                  ${
                    noPosts
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-green hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] cursor-pointer"
                  }
                `}
              >
                {/* NEW Badge */}
                {t.hasNew && !noPosts && (
                  <span className="absolute top-3 right-3 bg-green text-black text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    NEW
                  </span>
                )}

                {/* No posts */}
                {noPosts && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    No posts
                  </span>
                )}

                <h2 className="text-xl font-semibold mb-2 text-white">
                  {t.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {t.description || "No description provided"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
