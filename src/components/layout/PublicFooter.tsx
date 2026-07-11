import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { brand } from "@/config/brand";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Features", href: "/features" },
      { label: "For Schools", href: "/for-schools" },
      { label: "Sign Up", href: "/sign-up" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "MathQuest Games", href: "/explore#games" },
      { label: "MathQuest Simulations", href: "/explore#simulations" },
      { label: "MathQuest Books", href: "/explore#books" },
      { label: "Curriculum", href: "/features#curriculum" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <Logo theme="light" />
          <p className="max-w-xs text-sm text-white/60">{brand.supportingLine}</p>
          <p className="text-xs font-medium text-teal-300">{brand.owner}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {brand.year} Eduversal Indonesia. All rights reserved. {brand.name} is an educational
            platform aligned with Cambridge Early Years and Cambridge Primary Mathematics.
          </p>
          <p>{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
