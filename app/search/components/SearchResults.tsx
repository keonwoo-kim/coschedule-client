import { useState } from "react";
import axios from "@/lib/api";
import type { RedditPost } from "@/models/reddit";
import Modal from "@/components/Modal";
import Thumbnail from "@/app/search/components/Thumbnail";
import ModalContent from "@/app/search/components/ModalContent";

type SearchResultsProps = {
  results: RedditPost[];
};

export default function SearchResults({ results }: SearchResultsProps) {
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    redditId: string;
    itemId: number;
    redditPost: RedditPost;
  } | null>(null);

  const handleItemClick = async (item: RedditPost) => {
    if (loadingItem) return;
    setLoadingItem(item.data.id);

    try {
      const res = await axios.post("/items/ensure", {
        source: "Reddit",
        externalId: item.data.id,
        title: item.data.title,
        url: item.data.url
      });

      const itemId = res.data;
      setSelected({
        redditId: item.data.id,
        itemId,
        redditPost: item,
      });
    } catch (err) {
      console.error("Failed to ensure item", err);
      alert("Failed to prepare item.");
    } finally {
      setLoadingItem(null);
    }
  };

  const getBestImage = (item: RedditPost) =>
    item.data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
    item.data.thumbnail ||
    "";

  return (
    <>
      <ul className="space-y-4 mt-8">
        {results.map((item) => (
          <li
            key={item.data.id}
            className="p-4 rounded border hover:shadow transition"
          >
            <div
              onClick={() => handleItemClick(item)}
              className="cursor-pointer flex gap-4 items-center"
            >
              <Thumbnail src={getBestImage(item)} />
              <div>
                <h2 className="text-lg font-semibold text-blue-600">
                  {item.data.title}
                </h2>
                <p className="text-sm text-gray-600">
                  r/{item.data.subreddit} • u/{item.data.author}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <ModalContent
            redditPost={selected.redditPost}
            itemId={selected.itemId}
          />
        </Modal>
      )}
    </>
  );
}
