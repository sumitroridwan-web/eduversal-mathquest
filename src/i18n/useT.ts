"use client";

import { useCallback } from "react";
import { useLocale } from "@/stores/locale";
import { dictionaries, type MessageKey } from "./dictionaries";

/** Returns a translator for the current locale (falls back en → key). */
export function useT() {
  const locale = useLocale((s) => s.locale);
  return useCallback(
    (key: MessageKey): string => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    [locale],
  );
}
