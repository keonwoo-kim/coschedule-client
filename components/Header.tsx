import Link from "next/link";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const setToken = useUserStore((state) => state.setToken);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    setToken(null);
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-zinc-900 shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-600 hover:underline">
        CoSchedule OA
      </Link>

      {token && (
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </header>
  );
}
