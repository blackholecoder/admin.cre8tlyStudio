import { useState } from "react";
import { BadgeCheck } from "lucide-react";

export default function CommentNode({
  comment,
  postId,
  replyingTo,
  replyBody,
  setReplyingTo,
  setReplyBody,
  handleReplyToComment,
  adminId,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);

  return (
    <div className="mb-3">
      {/* Single Comment */}
      <div className="bg-gray-900/30 p-3 rounded border border-gray-700 ml-0">
        <div className="flex items-center gap-2 mb-1">
          {/* Avatar */}
          {comment.author_image ? (
            <img
              src={comment.author_image}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-gray-300">
              {comment.author?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {/* Name */}
          <span className="text-sm text-white">{comment.author}</span>

          {/* Admin badge */}
          {comment.author_role === "admin" && (
            <BadgeCheck size={14} className="text-green" />
          )}
        </div>

        {isEditing ? (
          <textarea
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2 text-sm"
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        ) : (
          <p className="text-gray-300 text-sm">{comment.body}</p>
        )}

        <div className="text-xs text-gray-500 mt-1">
          {new Date(comment.created_at).toLocaleString()}
        </div>

        {/* Reply button */}
        <button
          className="text-xs text-green hover:underline mt-2"
          onClick={() => setReplyingTo(comment.id)}
        >
          Reply
        </button>
        {/* Edit / Delete (only owner or admin) */}
        {comment.user_id === adminId && (
          <div className="flex gap-3 mt-2">
            {!isEditing && (
              <>
                <button
                  className="text-xs text-blue hover:underline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>

                <button
                  className="text-xs text-gray-400 hover:underline"
                  onClick={() => onDelete(comment.id)}
                >
                  Delete
                </button>
              </>
            )}

            {isEditing && (
              <>
                <button
                  className="text-xs text-green hover:underline"
                  onClick={() => {
                    onEdit({ ...comment, body: editText });
                    setIsEditing(false);
                  }}
                >
                  Save
                </button>

                <button
                  className="text-xs text-gray-400 hover:underline"
                  onClick={() => {
                    setEditText(comment.body);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply box */}
        {replyingTo === comment.id && (
          <div className="mt-2 ml-4">
            <textarea
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2"
              rows={2}
              placeholder="Write a reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleReplyToComment(postId, comment.id)}
                className="px-3 py-1 bg-green text-black rounded-md"
              >
                Reply
              </button>

              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyBody("");
                }}
                className="px-3 py-1 bg-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Children */}
      {comment.children?.length > 0 && (
        <div className="ml-6 mt-2 border-l border-gray-700 pl-4">
          {comment.children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              postId={postId}
              replyingTo={replyingTo}
              replyBody={replyBody}
              setReplyingTo={setReplyingTo}
              setReplyBody={setReplyBody}
              handleReplyToComment={handleReplyToComment}
              adminId={adminId}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
