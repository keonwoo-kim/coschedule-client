import { useState } from "react";
import type { RedditPost } from "@/models/reddit";
import ItemDetail from "@/components/ItemDetail";

export default function ModalContent({
  redditPost,
  itemId,
}: {
  redditPost: RedditPost;
  itemId: number;
}) {
  const { data } = redditPost;

  // gallery 이미지 추출
  const galleryItems = data.gallery_data?.items;
  const mediaMetadata = data.media_metadata;

  const images = galleryItems?.map((item) => 
    mediaMetadata?.[item.media_id]?.s?.u?.replace(/&amp;/g, "&")
  ).filter(Boolean) || [];

  const [current, setCurrent] = useState(0);

  // preview image fallback
  const previewUrl = data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&");
  const hasGallery = images.length > 0;
  const hasPreview = Boolean(previewUrl);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{data?.title}</h2>

      {/* Gallery */}
      {hasGallery ? (
        <div className="relative">
          <img
            src={images[current]}
            alt={`Image ${current + 1}`}
            className="w-full max-h-96 object-contain rounded border"
          />
          {images.length > 1 && (
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setCurrent((current - 1 + images.length) % images.length)}
                className="px-2 py-1 bg-gray-200 dark:bg-zinc-700 rounded"
              >
                ◀
              </button>
              <button
                onClick={() => setCurrent((current + 1) % images.length)}
                className="px-2 py-1 bg-gray-200 dark:bg-zinc-700 rounded"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      ) : hasPreview ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full max-h-96 object-contain rounded border"
        />
      ) : null}

      {/* Selftext */}
      {data?.selftext && (
        <p className="leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto text-gray-800 dark:text-gray-200">
          {data.selftext}
        </p>
      )}

      {/* Ratings + Comments */}
      <div className="border-t mt-6 pt-4">
        <ItemDetail itemId={itemId} />
      </div>
    </div>
  );
}
