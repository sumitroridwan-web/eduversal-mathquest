"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/i18n/dictionaries";

interface LocaleState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({ locale: "en", setLocale: (l) => set({ locale: l }) }),
    { name: "mathquest-locale" },
  ),
);
