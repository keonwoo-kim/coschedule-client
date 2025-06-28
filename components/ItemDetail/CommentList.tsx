import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import axios from "@/lib/api";
import Modal from "@/components/Modal";
import type { CommentDto } from "@/types/dtos";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function CommentList({
  comments,
  onReload,
}: {
  comments: CommentDto[];
  onReload: () => Promise<void>;
}) {
  const { id: currentUserId, hydrated } = useUserStore();
  const [editingComment, setEditingComment] = useState<CommentDto | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEditClick = (comment: CommentDto) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingComment) return;
    try {
      await axios.put("/comments", { id: editingComment.id, content: editContent.trim() });
      setEditingComment(null);
      await onReload();
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`/comments?id=${id}`);
      await onReload();
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  if (!hydrated) return null;

  return (
    <>
      <ul className="space-y-3">
        {comments.map(c => (
          <li key={c.id} className="border-b pb-2 flex justify-between items-start">
            <div>
              <strong>{c.userName}</strong>: {c.content}
              <div className="text-xs text-gray-500 mt-1">
                {dayjs(c.createdUtc).fromNow()}
              </div>
            </div>
            {currentUserId == c.userId && (
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(c)}
                  className="ml-2 text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="ml-2 text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {editingComment && (
        <Modal onClose={() => setEditingComment(null)}>
          <h2 className="text-lg font-bold mb-4">Edit Comment</h2>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") setEditingComment(null);
            }}
            className="border px-3 py-2 rounded w-full mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingComment(null)}
              className="px-4 py-2 rounded bg-gray-400 text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
