import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@/store/useUserStore';

export function useAuth() {
  const router = useRouter();
  const { token, hydrated, setHydrated } = useUserStore();

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace('/login');
    }
  }, [hydrated, token, router]);

  return { checked: hydrated, isAuthenticated: Boolean(token) };
}
