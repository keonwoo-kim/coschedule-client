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
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get<RatingDto[]>(`/ratings/getall?itemId=${itemId}`);
        if (res.data.length > 0) {
          setSelected(res.data[0].value);
        }
      } catch (err) {
        console.error("Failed to fetch rating", err);
      }
    };
    fetchRating();
  }, [itemId]);

  const handleClick = async (value: number) => {
    setSelected(value);
    try {
      await axios.post("/ratings", {
        itemId,
        value,
      });
      await onReload();
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={star <= (selected || 0) ? "text-yellow-400" : "text-gray-300"}
          onClick={() => handleClick(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
