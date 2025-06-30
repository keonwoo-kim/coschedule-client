import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";

export default function useProtect() {
  const router = useRouter();
  const { token, hydrated, setHydrated } = useUserStore();

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (hydrated && !token) {
      router.push("/login");
    }
  }, [hydrated, token, router]);
}
