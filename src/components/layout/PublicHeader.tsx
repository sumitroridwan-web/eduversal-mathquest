"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/useT";
import { LocaleSwitch } from "@/components/i18n/LocaleSwitch";
import type { MessageKey } from "@/i18n/dictionaries";

const links: { key: MessageKey; href: string }[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.explore", href: "/explore" },
  { key: "nav.about", href: "/about" },
  { key: "nav.features", href: "/features" },
  { key: "nav.forSchools", href: "/for-schools" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href
                  ? "text-teal-700"
                  : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
              )}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitch />
          <Button variant="ghost" size="sm" asChildHref="/login">
            {t("auth.login")}
          </Button>
          <Button variant="primary" size="sm" asChildHref="/sign-up">
            {t("auth.signUp")}
          </Button>
        </div>
        <button
          className="rounded-lg p-2 text-navy-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-navy-100 bg-white md:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                {t(l.key)}
              </Link>
            ))}
            <div className="mt-2 px-1"><LocaleSwitch /></div>
            <div className="mt-2 flex gap-2 px-1">
              <Button variant="outline" size="sm" asChildHref="/login" className="flex-1">
                {t("auth.login")}
              </Button>
              <Button variant="primary" size="sm" asChildHref="/sign-up" className="flex-1">
                {t("auth.signUp")}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
