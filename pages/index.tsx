import { useState } from "react";
import axios from "@/lib/api";
import type { RedditPost } from "@/models/reddit";
import LoginPage from "./login";
import { useAuth } from "@/hooks/useAuth";
import SearchLayout from "@/components/SearchLayout";

export default function SearchPage() {
  const { checked, isAuthenticated } = useAuth();
  const [results, setResults] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSearch = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/reddit/search?query=${encodeURIComponent(query)}`);
      setResults(res.data?.data?.children ?? []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  if (!checked) return null;
  if (!isAuthenticated) return <LoginPage />;

    return (
    <SearchLayout
      results={results}
      loading={loading}
      error={error}
      onSearch={onSearch}
    />
  );
}
