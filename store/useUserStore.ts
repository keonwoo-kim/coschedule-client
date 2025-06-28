import { create } from "zustand";

type UserState = {
  token: string | null;
  id: number | null;
  userId: string | null;
  userName: string | null;
  hydrated: boolean;
  setToken: (token: string | null) => void;
  setUser: (id: number | null, userId: string | null, userName: string | null) => void;
  setHydrated: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  token: null,
  id: null,
  userId: null,
  userName: null,
  hydrated: false,

  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
    set({ token });
  },

  setUser: (id, userId, userName) => {
    if (typeof window !== "undefined") {
      if (id !== null) localStorage.setItem("id", String(id));
      else localStorage.removeItem("id");

      if (userId !== null) localStorage.setItem("userId", userId);
      else localStorage.removeItem("userId");

      if (userName !== null) localStorage.setItem("userName", userName);
      else localStorage.removeItem("userName");
    }
    set({ id, userId, userName });
  },

  setHydrated: () => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      const localId = localStorage.getItem("id");
      const localUserId = localStorage.getItem("userId");
      const localUserName = localStorage.getItem("userName");

      set({
        token: localToken,
        id: localId ? parseInt(localId) : null,
        userId: localUserId ?? null,
        userName: localUserName ?? null,
        hydrated: true,
      });
    }
  },
}));
