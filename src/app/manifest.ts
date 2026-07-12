import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

// Web app manifest (served at /manifest.webmanifest and auto-linked by
// Next). Makes MathQuest installable to a home screen for classroom /
// tablet use. PNG 192/512 icons are the production follow-up; the SVG
// mark is used here so it stays crisp at any size.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: "MathQuest",
    description: brand.supportingLine,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#1b2540",
    categories: ["education", "kids"],
    icons: [
      { src: "/logo-mark.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/logo-mark.svg", sizes: "192x192", type: "image/svg+xml", purpose: "maskable" },
      { src: "/logo-mark.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
