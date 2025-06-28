import { useState } from "react";

export default function Thumbnail({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);

  if (!src.startsWith("http") || broken) {
    return (
      <div className="w-20 h-20 rounded border bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Thumbnail"
      className="w-20 h-20 object-cover rounded border"
      onError={() => setBroken(true)}
    />
  );
}
