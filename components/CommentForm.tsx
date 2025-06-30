import { useState } from "react";
import axios from "@/lib/api";

export default function CommentForm({
  itemId,
  onReload
}: {
  itemId: number;
  onReload: () => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await axios.post("/comments", { itemId, content });
      setContent("");
      await onReload();
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape") setContent("");
        }}
        maxLength={200}
        placeholder="Write a comment..."
        className="form-input"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
