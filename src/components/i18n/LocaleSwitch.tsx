"use client";

import { Globe } from "lucide-react";
import { useLocale } from "@/stores/locale";
import { LOCALES, type Locale } from "@/i18n/dictionaries";

export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  return (
    <label className={className}>
      <span className="sr-only">Language</span>
      <div className="inline-flex items-center gap-1 rounded-lg border border-navy-200 px-2 py-1.5 text-sm text-navy-700 focus-within:ring-2 focus-within:ring-teal-500">
        <Globe className="h-4 w-4 text-navy-400" aria-hidden />
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="bg-transparent font-medium focus:outline-none"
          aria-label="Choose language"
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
          ))}
        </select>
      </div>
    </label>
  );
}
