// Purpose: State management for session data
import { create, StateCreator } from "zustand";

import type { User } from "@/lib/types";

interface SessionSlice {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  user: typeof window !== "undefined" && localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user") as string) 
    : null,

  login: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user)); 
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user"); 
    }
    set({ user: null });
  },
});

export const useSession = create<SessionSlice>(createSessionSlice);

export { createSessionSlice, type SessionSlice };
