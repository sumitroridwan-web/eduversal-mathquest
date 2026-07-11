import Link from "next/link";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";

interface LogoProps {
  href?: string;
  variant?: "full" | "compact";
  theme?: "light" | "dark";
  className?: string;
}

/** Eduversal MathQuest wordmark with a subtle maths-motif glyph. */
export function Logo({ href = "/", variant = "full", theme = "dark", className }: LogoProps) {
  const textColor = theme === "dark" ? "text-navy-900" : "text-white";
  const subColor = theme === "dark" ? "text-navy-400" : "text-white/70";

  const mark = (
    <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0 rounded-xl shadow-sm" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mq-mark-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b2540" />
          <stop offset="1" stopColor="#31415f" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#mq-mark-bg)" />
      {/* faint maths grid */}
      <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1">
        <path d="M16 4V60M32 4V60M48 4V60M4 16H60M4 32H60M4 48H60" />
      </g>
      {/* number-line baseline */}
      <g stroke="#65d6ad" strokeWidth="2.5" strokeLinecap="round">
        <path d="M14 47H50" />
        <path d="M20 43.5V50.5M32 43.5V50.5M44 43.5V50.5" />
      </g>
      {/* plus / quest node */}
      <path d="M32 14V34M22 24H42" stroke="#ffb420" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="24" r="4" fill="#27ab83" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-[15px] font-bold tracking-tight", textColor)}>
            Eduversal <span className="text-teal-500">MathQuest</span>
          </span>
          <span className={cn("mt-0.5 text-[10px] font-medium", subColor)}>{brand.tagline}</span>
        </span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} aria-label={`${brand.name} home`}>
      {content}
    </Link>
  ) : (
    content
  );
}
