import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import CommentNode from "../components/community/CommentNode";
import { Calendar, ArrowLeft, ShieldCheck, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { headerLogo } from "../assets/images";

export default function AdminSinglePost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  // Comment interaction state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyBody, setReplyBody] = useState("");

  const adminId = localStorage.getItem("adminId");

  // Load post when screen loads or postId changes
  useEffect(() => {
    reloadPost();
  }, [postId]);

  async function reloadPost() {
    const res = await api.get(`/admin/community/post/${postId}`);

    setPost({
      ...res.data.post,
      comments: res.data.comments,
    });

    // 🔥 Mark seen when viewing post
    await api.post(`/admin/community/post/${postId}/mark-seen`);
  }

  // Build nested comment tree
  function buildCommentTree(comments) {
    const map = {};
    const roots = [];

    comments.forEach((c) => {
      c.children = [];
      map[c.id] = c;
    });

    comments.forEach((c) => {
      if (c.parent_id) {
        map[c.parent_id]?.children.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  }

  // ===== COMMENT ACTIONS =====

  async function handleDeleteComment(commentId) {
    toast.dismiss(); // clear existing toast

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-3 text-center">
          <p className="text-sm font-medium text-gray-100">
            Are you sure you want to delete this comment?
          </p>

          <div className="flex justify-center gap-3 mt-2">
            {/* DELETE BUTTON */}

            {/* CANCEL BUTTON */}
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-xs font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await api.delete(`/admin/community/comments/${commentId}`);

                  toast.success("Comment deleted", {
                    position: "top-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });

                  await reloadPost(); // refresh UI
                  closeToast();
                } catch (err) {
                  toast.error("Delete failed", {
                    position: "top-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
        style: {
          background: "#0B0F19",
          border: "1px solid #1F2937",
          color: "#E5E7EB",
          borderRadius: "0.75rem",
          padding: "14px 18px",
          width: "340px",
          textAlign: "center",
          marginTop: "80px",
        },
      }
    );
  }

  async function handleDeletePost(postId) {
    toast.dismiss();

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-3 text-center">
          <p className="text-sm font-medium text-gray-100">
            Are you sure you want to delete this post?
          </p>

          <div className="flex justify-center gap-3 mt-2">
            {/* CANCEL */}
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-xs font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            {/* DELETE */}
            <button
              onClick={async () => {
                try {
                  await api.delete(`/admin/community/posts/${postId}`);

                  toast.success("Post deleted", {
                    position: "top-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });

                  closeToast();

                  // Navigate back to the topic list
                  navigate(`/admin/community/topic/${post.topic_id}`);
                } catch (err) {
                  toast.error("Failed to delete post", {
                    position: "top-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
        style: {
          background: "#0B0F19",
          border: "1px solid #1F2937",
          color: "#E5E7EB",
          borderRadius: "0.75rem",
          padding: "14px 18px",
          width: "340px",
          textAlign: "center",
          marginTop: "80px",
        },
      }
    );
  }

  async function handleEditComment(comment) {
    await api.put(`/admin/community/comments/${comment.id}`, {
      body: comment.body,
    });
    await reloadPost();
  }

  async function handleReplyToComment(postId, parentId) {
    if (!replyBody.trim()) return;

    await api.post(`/admin/community/post/${postId}/comment`, {
      body: replyBody,
      parent_id: parentId,
    });

    setReplyBody("");
    setReplyingTo(null);
    await reloadPost();
  }

  if (!post) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-sm text-gray-400 pb-2">
  {/* Left side — breadcrumb links */}
  <div className="flex items-center gap-1">
    <span
      className="cursor-pointer hover:text-white"
      onClick={() => navigate("/admin/community")}
    >
      Community Topics
    </span>

    <span className="text-gray-600">/</span>

    <span
      className="cursor-pointer hover:text-white"
      onClick={() => navigate(`/admin/community/topic/${post.topic_id}`)}
    >
      {post.topic_name}
    </span>

    <span className="text-gray-600">/</span>

    <span className="text-white truncate max-w-[300px]">{post.title}</span>
  </div>

  {/* Right side — Back button */}
  <button
    onClick={() => navigate(`/admin/community/topic/${post.topic_id}`)}
    className="flex items-center gap-1 text-gray-400 hover:text-white"
  >
    <ArrowLeft size={14} />
    Back
  </button>
</div>


      

      {/* POST CARD */}
      <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-xl space-y-4 shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={() => handleDeletePost(post.id)}
            className="text-gray-200 hover:text-red-600 text-sm underline"
          >
            <Trash size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {post.author_role === "admin" ? (
            <img
              src={headerLogo}
              className="w-12 h-12 rounded-full object-cover border border-gray-700 bg-gray-800 p-1"
              alt="Cre8tly"
            />
          ) : post.author_image ? (
            <img
              src={post.author_image}
              className="w-12 h-12 rounded-full object-cover border border-gray-700"
              alt="avatar"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-lg text-gray-300">
              {post.author?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <p className="text-white font-semibold text-lg flex items-center gap-2">
              {post.author}
              {post.author_role === "admin" && (
                <span className="flex items-center gap-1 text-white text-[10px] px-2 py-0.5 border border-green rounded-full">
                  <ShieldCheck size={11} className="text-green" />
                  Official
                </span>
              )}
            </p>

            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white">{post.title}</h2>

        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.body}
        </p>
      </div>

      {/* COMMENTS SECTION */}
      <div className="bg-gray-800/40 border border-gray-700 p-5 rounded-xl space-y-4">
        <h3 className="text-white text-lg font-semibold">Comments</h3>

        {buildCommentTree(post.comments || []).map((c) => (
          <CommentNode
            key={c.id}
            comment={c}
            postId={post.id}
            replyingTo={replyingTo}
            replyBody={replyBody}
            setReplyingTo={setReplyingTo}
            setReplyBody={setReplyBody}
            handleReplyToComment={handleReplyToComment}
            adminId={adminId}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}

        {/* TOP LEVEL REPLY */}
        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white mt-4"
          placeholder="Write a reply..."
        />

        <button
          onClick={async () => {
            if (!replyBody.trim()) return;
            await api.post(`/admin/community/post/${post.id}/comment`, {
              body: replyBody,
            });
            setReplyBody("");
            reloadPost();
          }}
          className="bg-green text-black px-4 py-1 rounded mt-2 hover:opacity-90"
        >
          Post Reply
        </button>
      </div>
    </div>
  );
}
