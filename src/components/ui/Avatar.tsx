import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  emoji?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export function Avatar({ name, emoji, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-navy-100 font-semibold text-navy-700 ring-2 ring-white",
        sizes[size],
        className,
      )}
      aria-hidden={Boolean(emoji)}
      title={name}
    >
      {emoji ?? initials(name)}
    </span>
  );
}
