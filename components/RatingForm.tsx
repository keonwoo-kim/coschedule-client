import { useState, useEffect } from "react";
import axios from "@/lib/api";
import type { RatingDto } from "@/types/dtos";

export default function RatingForm({
  itemId,
  onReload
}: {
  itemId: number;
  onReload: () => Promise<void>;
}) {
  const [rating, setRating] = useState<{ id: number, value: number } | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get<RatingDto[]>(`/ratings/getall?itemId=${itemId}`);
        if (res.data.length > 0) {
          const first = res.data[0];
          setRating({ id: first.id, value: first.value });
        }
      } catch (err) {
        console.error("Failed to fetch rating", err);
      }
    };
    fetchRating();
  }, [itemId]);

  const handleClick = async (value: number) => {
    const prev = rating;
    setRating(prev => prev ? { ...prev, value } : { id: 0, value });  // 임시 id=0

    try {
      if (!prev) {
        await axios.post("/ratings", { itemId, value });
      } else {
        await axios.put("/ratings", { id: prev.id, itemId, value });
      }
      await onReload();
    } catch (err) {
      console.error("Failed to submit rating", err);
      setRating(prev); 
    }
  };

  return (
    <div className="flex gap-1 mt-2 mb-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`${star <= (rating?.value || 0) ? "text-yellow-400" : "text-gray-300"} text-5xl hover:scale-110 transition-transform`}
          onClick={() => handleClick(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
