import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/api";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import RatingForm from "./RatingForm";
import type { CommentDto } from "@/types/dtos";

export default function ItemDetail({ itemId }: { itemId: number }) {
  const [comments, setComments] = useState<CommentDto[]>([]);

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get<CommentDto[]>(`/comments/GetAll?itemId=${itemId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  }, [itemId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="mt-4 space-y-4">
      <RatingForm itemId={itemId} onReload={loadData} />
      <CommentList comments={comments} onReload={loadData} />
      <CommentForm itemId={itemId} onReload={loadData} />
    </div>
  );
}
