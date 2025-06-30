'use client';

import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/api";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import RatingForm from "@/components/RatingForm";
import Image from "next/image";
import type { CommentDto, RatingDto } from "@/types/dtos";
import type { RedditPost } from "@/models/reddit";

export default function ModalContent({
  itemId,
  redditPost
}: {
  itemId: number;
  redditPost: RedditPost;
}) {
  const { data } = redditPost;

  const [comments, setComments] = useState<CommentDto[]>([]);
  const [ratings, setRatings] = useState<RatingDto[]>([]);

  const galleryItems = data.gallery_data?.items;
  const mediaMetadata = data.media_metadata;
  const images = galleryItems?.map(item =>
    mediaMetadata?.[item.media_id]?.s?.u?.replace(/&amp;/g, "&")
  ).filter(Boolean) || [];

  const [current, setCurrent] = useState(0);

  const previewUrl = data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&");
  const hasGallery = images.length > 0;
  const hasPreview = Boolean(previewUrl);

  const loadData = useCallback(async () => {
    try {
      const commentRes = await axios.get<CommentDto[]>(`/comments/getAll?itemId=${itemId}`);
      setComments(commentRes.data);
      const ratingRes = await axios.get<RatingDto[]>(`/ratings/getAll?itemId=${itemId}`);
      setRatings(ratingRes.data);
    } catch (err) {
      console.error("Failed to load comments or ratings", err);
    }
  }, [itemId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div>
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="form-label mt-1">
        r/{data.subreddit} • u/{data.author} • original post: {data.url}
      </p>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        average user rating: {ratings.length > 0 
          ? (ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length).toFixed(2)
          : "No ratings yet"
        }
      </div>

      {/* Gallery */}
      {hasGallery ? (
        <div className="relative w-full h-[70vh] mt-2">
          <Image 
            src={images[current]!}
            alt={`Image ${current + 1}`}
            fill
            className="w-full h-full object-contain rounded border"
          />
          {images.length > 1 && (
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setCurrent((current - 1 + images.length) % images.length)}
                className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 rounded"
              >
                ◀
              </button>
              <button
                onClick={() => setCurrent((current + 1) % images.length)}
                className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 rounded"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      ) : hasPreview ? (
        <div className="relative w-full h-[70vh] mt-3">
          <Image 
            src={previewUrl!}
            alt="Preview"
            fill
            className="object-contain rounded border"
          />
        </div>
      ) : null}

      {/* Selftext */}
      {data.selftext && (
        <p className="leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto text-gray-800 dark:text-gray-200 mt-3">
          {data.selftext}
        </p>
      )}

      {/* Rating + Comments */}
      <div className="border-t mt-6">
        <RatingForm itemId={itemId} onReload={loadData} />
        <CommentList comments={comments} onReload={loadData} />
        <CommentForm itemId={itemId} onReload={loadData} />
      </div>
    </div>
  );
}
