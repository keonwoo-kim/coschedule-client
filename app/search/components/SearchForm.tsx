import { useState } from "react";

export default function SearchForm({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 mb-6"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Reddit posts..."
        className="form-input"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
      >
        Search
      </button>
    </form>
  );
}
