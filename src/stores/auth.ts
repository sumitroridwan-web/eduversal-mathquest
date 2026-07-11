"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/types";
import { findDemoAccount, demoUserForRole } from "@/data/users";

interface AuthState {
  user: User | null;
  status: "authenticated" | "unauthenticated";
  hydrated: boolean;
  login: (email: string, password: string) => { ok: boolean; user?: User; error?: string };
  loginAsRole: (role: Role) => User;
  logout: () => void;
  setHydrated: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: "unauthenticated",
      hydrated: false,
      login: (email, password) => {
        const user = findDemoAccount(email, password);
        if (!user) {
          return { ok: false, error: "Incorrect email or password. Try a demo account below." };
        }
        set({ user, status: "authenticated" });
        return { ok: true, user };
      },
      loginAsRole: (role) => {
        const user = demoUserForRole(role);
        set({ user, status: "authenticated" });
        return user;
      },
      logout: () => set({ user: null, status: "unauthenticated" }),
      setHydrated: () => set({ hydrated: true }),
      updateUser: (patch) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...patch } });
      },
    }),
    {
      name: "mathquest-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
