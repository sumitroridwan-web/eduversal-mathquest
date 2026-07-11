import { Badge } from "@/components/ui/Badge";

export function MarketingHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy-100 bg-white">
      <div className="math-grid absolute inset-0 opacity-50" aria-hidden />
      <div className="container-page relative py-14 lg:py-16">
        {eyebrow && <Badge tone="teal" className="mb-3">{eyebrow}</Badge>}
        <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-navy-600">{subtitle}</p>}
      </div>
    </section>
  );
}
