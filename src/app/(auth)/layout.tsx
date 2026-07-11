import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { brand } from "@/config/brand";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "16+ curriculum-aligned games",
  "Interactive maths simulations",
  "Digital books with checkpoints",
  "Progress tracked by objective",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="math-grid absolute inset-0 opacity-10" aria-hidden />
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
        <Logo theme="light" href="/" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight">{brand.heroTitle}</h2>
          <p className="mt-4 max-w-md text-white/70">{brand.supportingLine}</p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-white/80">
                <CheckCircle2 className="h-5 w-5 text-teal-400" /> {h}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/50">{brand.owner}</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Logo />
          <Link href="/" className="text-sm font-medium text-navy-500 hover:text-navy-800">
            ← Home
          </Link>
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
