'use client';

import { useState } from "react";
import axios from "@/lib/api";
import SearchLayout from "@/app/search/components/SearchLayout";
import type { RedditPost } from "@/models/reddit";
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const [results, setResults] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { checked, isAuthenticated } = useAuth();

  if (!checked) return null;
  if (!isAuthenticated) return null;

  const onSearch = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/reddit/search?query=${encodeURIComponent(query)}`);
      setResults(res.data?.data?.children ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchLayout
      results={results}
      loading={loading}
      error={error}
      onSearch={onSearch}
    />
  );
}
