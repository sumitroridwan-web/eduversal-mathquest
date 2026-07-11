"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "error" | "info";
}

interface ToastState {
  toasts: Toast[];
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

let counter = 0;

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  notify: (t) => {
    counter += 1;
    const id = `t-${counter}`;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
      }, 4000);
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

interface FavouritesState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useFavourites = create<FavouritesState>()(
  persist(
    (set, get) => ({
      ids: ["res-addition-race", "res-tenframe"],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "mathquest-favourites" },
  ),
);
