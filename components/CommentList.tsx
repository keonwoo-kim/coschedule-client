import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import axios from "@/lib/api";
import Modal from "@/components/Modal";
import type { CommentDto } from "@/types/dtos";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserIcon } from "@heroicons/react/24/solid";
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
          <li
            key={c.id}
            className="bg-gray-100 dark:bg-zinc-800/50 p-4 rounded-lg shadow flex justify-between items-start"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <strong className="text-gray-800 dark:text-blue-400">{c.userName}</strong>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200">{c.content}</p>
              <div className="text-xs text-gray-600 dark:text-gray-400 italic mt-1"
                title={dayjs(c.createdUtc).format("YYYY-MM-DD HH:mm:ss")}
              >
                {dayjs(c.createdUtc).fromNow()}
                {c.createdUtc !== c.updatedUtc && (
                  <> • edited {dayjs(c.updatedUtc).fromNow()}</>
                )}
              </div>
            </div>
            {currentUserId == c.userId && (
              <div className="space-x-1">
                <button
                  onClick={() => handleEditClick(c)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full"
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
            className="border px-3 py-2 rounded w-full mb-4
              bg-white text-gray-900 placeholder-gray-400
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
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
