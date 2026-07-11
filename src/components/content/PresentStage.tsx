"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn, clamp } from "@/lib/utils";

/**
 * Shared full-screen presentation shell used by every activity type
 * (games, simulations, books). Tries the native Fullscreen API first and
 * falls back to a fixed overlay when it is unavailable or blocked. In
 * presenting mode the content is centred and zoomable so it reads from the
 * back of a classroom; Esc exits the overlay fallback.
 */
export function PresentStage({
  title,
  children,
  defaultZoom = 1.4,
  stageWidth = 620,
  buttonLabel = "Full screen",
}: {
  title: string;
  children: React.ReactNode;
  defaultZoom?: number;
  stageWidth?: number;
  buttonLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [nativeFS, setNativeFS] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const presenting = nativeFS || overlay;

  useEffect(() => {
    const onChange = () => setNativeFS(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOverlay(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [overlay]);

  const present = async () => {
    const el = ref.current;
    if (el?.requestFullscreen) {
      try { await el.requestFullscreen(); return; } catch { /* fall back to overlay */ }
    }
    setOverlay(true);
  };
  const exit = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); setOverlay(false); };
  const bump = (d: number) => setZoom((z) => clamp(Number((z + d).toFixed(2)), 0.8, 3));

  return (
    <div ref={ref} className={cn(overlay ? "fixed inset-0 z-[80] flex flex-col bg-surface-soft" : nativeFS ? "flex h-full w-full flex-col bg-surface-soft" : "relative")}>
      {presenting && (
        <header className="flex items-center justify-between gap-3 border-b border-navy-100 bg-white px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Badge tone="teal">Presenting</Badge>
            <p className="truncate font-display font-semibold text-navy-900">{title}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => bump(-0.2)} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
            <span className="w-12 text-center text-sm font-semibold text-navy-600 tabular-nums">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => bump(0.2)} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
            <Button variant="primary" size="sm" onClick={exit}><Minimize2 className="h-4 w-4" /> Exit</Button>
          </div>
        </header>
      )}
      <div className={cn(presenting && "flex flex-1 justify-center overflow-auto p-6")}>
        <div style={presenting ? { transform: `scale(${zoom})`, transformOrigin: "top center", width: stageWidth, maxWidth: "100%" } : undefined}>
          {children}
        </div>
      </div>
      {!presenting && (
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={present}><Maximize2 className="h-4 w-4" /> {buttonLabel}</Button>
        </div>
      )}
    </div>
  );
}
