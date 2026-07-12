"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Global mute preference, shared across games, simulations, books and
// multiplayer, persisted so it survives a refresh.
interface SoundState {
  muted: boolean;
  setMuted: (m: boolean) => void;
  toggle: () => void;
}

export const useSound = create<SoundState>()(
  persist(
    (set, get) => ({
      muted: false,
      setMuted: (m) => set({ muted: m }),
      toggle: () => set({ muted: !get().muted }),
    }),
    { name: "mathquest-muted" },
  ),
);
