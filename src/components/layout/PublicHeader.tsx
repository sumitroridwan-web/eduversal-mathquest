"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "For Schools", href: "/for-schools" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChildHref="/login">
            Login
          </Button>
          <Button variant="primary" size="sm" asChildHref="/sign-up">
            Sign Up
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
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-1">
              <Button variant="outline" size="sm" asChildHref="/login" className="flex-1">
                Login
              </Button>
              <Button variant="primary" size="sm" asChildHref="/sign-up" className="flex-1">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
