'use client';

import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/api";
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";
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
  const router = useRouter();
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

  const handleAuthError = (err: any) => {
    if (err?.response?.status === 401) {
      const userStore = useUserStore.getState();
      userStore.setToken(null);
      router.replace("/login");
    } else {
      console.error(err);
    }
  };

  const loadComments = useCallback(async () => {
    try {
      const res = await axios.get<CommentDto[]>(`/comments/getAll?itemId=${itemId}`);
      setComments(res.data);
    } catch (err: any) {
      handleAuthError(err);
    }
  }, [itemId, router]);

  const loadRatings = useCallback(async () => {
    try {
      const res = await axios.get<RatingDto[]>(`/ratings/getAll?itemId=${itemId}`);
      setRatings(res.data);
    } catch (err: any) {
      handleAuthError(err);
    }
  }, [itemId, router]);

  useEffect(() => {
    loadComments();
    loadRatings();
  }, [loadComments, loadRatings]);

  return (
    <div>
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <li className="form-label mt-1">
        r/{data.subreddit} • u/{data.author} • original post: {data.url} 
      </li>
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
            className="object-contain rounded border"
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
        <RatingForm itemId={itemId} onReload={loadRatings} />
        <CommentList comments={comments} onReload={loadComments} />
        <CommentForm itemId={itemId} onReload={loadComments} />
      </div>
    </div>
  );
}
