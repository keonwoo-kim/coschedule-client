import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import type { RedditPost } from "@/models/reddit";

type SearchLayoutProps = {
  results: RedditPost[];
  loading: boolean;
  error: string;
  onSearch: (query: string) => void;
};

export default function SearchLayout({
  results,
  loading,
  error,
  onSearch
}: SearchLayoutProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reddit Search</h1>

      <SearchForm onSearch={onSearch} />

      {loading && <p className="text-gray-400 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && !error && results.length > 0 && (
        <SearchResults results={results} />
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-500 mt-4">
          No results found. Try a search above.
        </p>
      )}
    </div>
  );
}
