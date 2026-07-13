import { cn } from "@/lib/utils";
import type { Resource } from "@/types";
import { getStorybook, coverImageSrc, type StoryBook, type Level } from "@/data/storybooks";
import { FONT, Star, PaperFX } from "./storyKit";
import { Illustration } from "./Illustration";

// ==========================================================
// BookCover — a real children's-book front cover: focal cartoon
// illustration + title + subtitle + a level ribbon and a spine.
// The SAME component is the library thumbnail AND the e-book's
// front cover (mode="full"), so the preview always matches.
// ==========================================================

const LEVEL_TAG: Record<Level, string> = {
  EY: "Ages 3–4", KG: "Ages 4–5", G1: "Grade 1", G2: "Grade 2", G3: "Grade 3", G4: "Grade 4", G5: "Grade 5", G6: "Grade 6",
};

function wrap(title: string, max: number): string[] {
  const words = title.split(" ");
  const lines: string[] = []; let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

// A clean, portrait "real book" cover: full-bleed illustration with the
// title on a footer band — like a picture book on a shelf (Let's-Read style).
export function CleanCover({ book, className }: { book: StoryBook; className?: string }) {
  const ink = book.titleColor ?? "#1b2540";
  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5", className)}>
      <div className="relative flex-1" style={{ backgroundImage: `linear-gradient(160deg, ${book.coverFrom}, ${book.coverTo})` }}>
        <div className="absolute inset-0"><Illustration image={coverImageSrc(book)} scene={book.cover} fit="slice" /></div>
        {book.audio && <div className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-xs shadow">🔊</div>}
      </div>
      <div className="shrink-0 px-3 py-3 text-center" style={{ borderTop: `3px solid ${book.accent}` }}>
        <h3 className="font-display text-base font-extrabold leading-tight sm:text-lg" style={{ color: ink }}>{book.title}</h3>
        {book.author && <p className="mt-0.5 text-[11px] font-semibold text-navy-400">{book.author}</p>}
        <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: book.accent }}>{LEVEL_TAG[book.level]}</span>
      </div>
    </div>
  );
}

export function StoryCover({ book, mode = "thumb", className }: { book: StoryBook; mode?: "thumb" | "full"; className?: string }) {
  if (book.readerStyle === "clean") return <CleanCover book={book} className={className} />;
  const lines = wrap(book.title, 17);
  const plateH = 22 + lines.length * 20 + 14;
  const ink = book.titleColor ?? "#1b2540";
  const titleSize = lines.length >= 3 ? 17 : 20;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* illustration */}
        {book.cover}
        <PaperFX />
        {/* soft top scrim so the title reads over any scene */}
        <defs>
          <linearGradient id={`scrim-${book.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={320} height={96} fill={`url(#scrim-${book.id})`} />
        {/* title plate */}
        <rect x={14} y={10} width={292} height={plateH} rx={13} fill="#ffffff" opacity={0.9} stroke={book.accent} strokeWidth={2} />
        {lines.map((ln, i) => (
          <text key={i} x={160} y={34 + i * 20} fontSize={titleSize} fontWeight={800} fill={ink} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{ln}</text>
        ))}
        <text x={160} y={20 + lines.length * 20 + 8} fontSize={10.5} fontWeight={600} fill="#5a6b8c" textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{book.subtitle}</text>
        {/* level ribbon */}
        <g transform="translate(16 196)">
          <rect x={0} y={-13} width={LEVEL_TAG[book.level].length * 6.6 + 16} height={20} rx={10} fill={book.accent} />
          <text x={LEVEL_TAG[book.level].length * 3.3 + 8} y={-2.5} fontSize={10.5} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{LEVEL_TAG[book.level]}</text>
        </g>
        {/* audio badge */}
        {book.audio && <g transform="translate(292 196)"><circle cx={0} cy={-3} r={13} fill="#ffffff" opacity={0.92} stroke={book.accent} strokeWidth={1.5} /><text x={0} y={-2} fontSize={13} textAnchor="middle" dominantBaseline="central">🔊</text></g>}
        {/* MathQuest star + book spine to feel like a real book */}
        <g transform="translate(292 22)"><Star x={0} y={0} s={4} fill="#ffd84d" /></g>
        <rect x={0} y={0} width={mode === "full" ? 10 : 7} height={220} fill={book.accent} opacity={0.9} />
        <rect x={mode === "full" ? 10 : 7} y={0} width={3} height={220} fill="#000" opacity={0.08} />
      </svg>
    </div>
  );
}

// Library thumbnail entry point — matches GameCover/SimCover signature.
export function BookCover({ resource, className }: { resource: Resource; className?: string }) {
  const book = getStorybook(resource.id);
  if (!book) {
    // fallback for any book without an authored storybook yet
    return <div className={cn("relative overflow-hidden bg-gradient-to-br from-teal-500 to-navy-700", className)}>
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <span className="font-display text-lg font-bold text-white">{resource.title}</span>
      </div>
    </div>;
  }
  return <StoryCover book={book} mode="thumb" className={className} />;
}
