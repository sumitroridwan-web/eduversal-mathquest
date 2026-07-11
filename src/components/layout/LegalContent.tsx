export function LegalContent({ sections }: { sections: { heading: string; body: string[] }[] }) {
  return (
    <div className="container-page max-w-3xl py-14">
      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="font-display text-lg font-semibold text-navy-900">
              {i + 1}. {s.heading}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-2 text-sm leading-relaxed text-navy-600">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 border-t border-navy-100 pt-6 text-xs text-navy-400">
        This is placeholder prototype text and does not constitute legal advice. Replace with your
        organisation&apos;s reviewed policy before production use.
      </p>
    </div>
  );
}
