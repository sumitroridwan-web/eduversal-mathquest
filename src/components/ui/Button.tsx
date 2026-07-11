import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 focus-visible:ring-navy-700 shadow-sm",
  secondary: "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500 shadow-sm",
  accent: "bg-accent-400 text-navy-950 hover:bg-accent-300 focus-visible:ring-accent-500 shadow-sm",
  outline: "border border-navy-200 bg-white text-navy-800 hover:bg-surface-soft",
  ghost: "text-navy-700 hover:bg-navy-50",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5 py-3.5",
  icon: "h-10 w-10 justify-center",
};

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChildHref?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, asChildHref, disabled, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    if (asChildHref) {
      return (
        <Link href={asChildHref} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
