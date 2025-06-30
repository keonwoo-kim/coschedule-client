'use client';

import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function Header({ onMenu }: { onMenu: () => void }) {
  const token = useUserStore((state) => state.token);
  const setToken = useUserStore((state) => state.setToken);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-zinc-900 shadow">
      <div className="flex items-center space-x-4">
        <button onClick={onMenu} className="text-xl">☰</button>
        <Link href="/" className="text-xl font-bold text-blue-600">CoSchedule OA</Link>
      </div>
      
      {token && (
        <button
          onClick={() => setToken(null)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      )}
    </header>
  );
}
