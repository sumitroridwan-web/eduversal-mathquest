"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Renders a painted image when available, otherwise the SVG scene.
// If the image 404s or errors, it falls back to the SVG automatically —
// so a book works with the SVG art today and upgrades to painted art the
// moment PNG/WebP files are dropped into its imageBase folder.
export function Illustration({ image, scene, fit = "meet", className }: {
  image?: string;
  scene: React.ReactNode;
  fit?: "meet" | "slice"; // contain vs cover
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [image]); // retry when the src changes

  if (image && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" loading="lazy" onError={() => setFailed(true)}
      className={cn("h-full w-full", fit === "slice" ? "object-cover" : "object-contain", className)} />;
  }
  return <svg viewBox="0 0 320 220" preserveAspectRatio={fit === "slice" ? "xMidYMid slice" : "xMidYMid meet"} className={cn("h-full w-full", className)}>{scene}</svg>;
}
