// ==========================================================
// i18n scaffold. A lightweight, dependency-free dictionary keyed
// by short ids. English is the source of truth; other locales
// fall back to English then to the key. Extend by adding keys
// here and swapping literals for t("key") at call sites, or move
// to next-intl once every string is extracted.
// ==========================================================

export type Locale = "en" | "id";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
];

export type MessageKey =
  | "nav.home" | "nav.explore" | "nav.about" | "nav.features" | "nav.forSchools"
  | "auth.login" | "auth.signUp"
  | "common.start" | "common.loading" | "brand.tagline";

export const dictionaries: Record<Locale, Record<MessageKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.about": "About",
    "nav.features": "Features",
    "nav.forSchools": "For Schools",
    "auth.login": "Login",
    "auth.signUp": "Sign Up",
    "common.start": "Start",
    "common.loading": "Loading…",
    "brand.tagline": "Play. Explore. Master Maths.",
  },
  id: {
    "nav.home": "Beranda",
    "nav.explore": "Jelajahi",
    "nav.about": "Tentang",
    "nav.features": "Fitur",
    "nav.forSchools": "Untuk Sekolah",
    "auth.login": "Masuk",
    "auth.signUp": "Daftar",
    "common.start": "Mulai",
    "common.loading": "Memuat…",
    "brand.tagline": "Bermain. Jelajahi. Kuasai Matematika.",
  },
};
