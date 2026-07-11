import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface StatusScreenProps {
  icon: string;
  tone?: "red" | "amber" | "navy";
  code?: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

const tones = {
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  navy: "bg-navy-50 text-navy-700",
};

export function StatusScreen({
  icon,
  tone = "navy",
  code,
  title,
  description,
  primary,
  secondary,
}: StatusScreenProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-soft">
      <header className="container-page flex h-16 items-center">
        <Logo />
      </header>
      <main id="main" className="container-page flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-card">
          <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${tones[tone]}`}>
            <Icon name={icon} className="h-8 w-8" />
          </span>
          {code && <p className="mt-4 font-mono text-sm font-semibold text-navy-300">{code}</p>}
          <h1 className="mt-2 font-display text-2xl font-bold text-navy-900">{title}</h1>
          <p className="mt-2 text-sm text-navy-500">{description}</p>
          <div className="mt-7 flex flex-col gap-2">
            {primary && (
              <Button asChildHref={primary.href} size="lg" className="w-full">
                {primary.label}
              </Button>
            )}
            {secondary && (
              <Button asChildHref={secondary.href} variant="ghost" className="w-full">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </main>
      <footer className="container-page py-6 text-center text-xs text-navy-400">
        <Link href="/" className="hover:text-navy-700">Eduversal MathQuest</Link>
      </footer>
    </div>
  );
}
