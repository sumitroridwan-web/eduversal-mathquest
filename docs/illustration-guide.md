# MathQuest — Painted Illustration Pipeline & Prompt Guide

The storybooks ship with hand-built **SVG** art. Any book can be upgraded to
**painted raster art** (PNG/JPG/WebP) with zero code changes — the reader
shows the painted image and automatically falls back to the SVG if a file is
missing. This doc explains the pipeline and gives ready-to-use generation
prompts for the sample book **"A Cake to Share"**.

---

## 1. How the pipeline works

Set two fields on a book (see `src/data/storybookSample.tsx`):

```ts
imageBase: "/books/res-book-cake-to-share",  // folder under /public
imageExt: "jpg",                              // png | jpg | webp
```

The reader then looks for:

| File | Used for |
|------|----------|
| `<imageBase>/cover.<ext>` | front cover (portrait) |
| `<imageBase>/p1.<ext>` … `pN.<ext>` | story pages, 1-indexed |

- Missing/broken file → it silently renders the **SVG scene** instead (`Illustration` component, `src/components/content/Illustration.tsx`).
- A single page can override its path with `page.image = "/books/.../special.webp"`.
- No engine changes are needed — drop files in `public/books/<book-id>/` and they appear.

**The `.jpg` files currently in `public/books/res-book-cake-to-share/` are
auto-generated placeholders (rasterised from the SVG). Replace them with real
painted art using the prompts below — same names, same folder.**

### Image specs
- **Cover**: portrait **3:4** (e.g. 1200×1600). It's shown `object-cover` in a portrait card.
- **Pages**: landscape ~**3:2** (e.g. 1500×1000). Shown `object-contain`, so any close ratio is fine.
- **Format/size**: WebP preferred (smallest). Keep each page < ~150 KB. **No text/words baked into the image** — the app overlays the sentence itself.

---

## 2. Art direction (use on every prompt)

> Warm, hand-painted **gouache / watercolour children's picture-book**
> illustration. Soft diffused lighting, cosy palette of peach, cream, blush
> pink and warm browns, gentle paper texture, rounded friendly shapes, clean
> uncluttered background, expressive faces, joyful mood. Flat storybook
> perspective. No text, no words, no letters.

## 3. Character bible (keep identical across all pages)

- **Mia** — the girl who just moved in. Age ~6. Warm brown skin, a big round
  natural **afro** (very dark brown), large curious eyes, rosy cheeks, a
  **coral-pink** t-shirt and indigo shorts. Small, lively, expressive.
- **Tomo** — friendly neighbour boy, ~7. Medium tan skin, **short tidy
  reddish-brown hair** with a side part, light freckles, a **leaf-green**
  t-shirt and denim shorts. Cheerful, energetic.
- **Tara** — Tomo's twin sister, ~7. Light peachy skin, dark hair in a **neat
  bun** with a few loose strands, a **sky-blue striped** t-shirt and red
  skirt. Warm, giggly.
- **The cake** — a round cake with **soft pink frosting**, a piped scalloped
  border, cream sponge, small cherries, and (on welcome pages) a few candles,
  on a white plate.

> **Consistency is the hard part.** Lock the characters with a reference:
> Midjourney `--cref <url> --cw 100` + `--sref`; GPT-4o / "nano-banana": paste
> the previous page as a reference each time; SDXL: train a small **LoRA** or
> use **IP-Adapter** on a character sheet. Generate one clean "character sheet"
> first, then reuse it for every page.

---

## 4. Per-page prompts — "A Cake to Share"

Append the **Art direction** (§2) and relevant **character descriptions**
(§3) to each. Cover is portrait 3:4; pages are landscape 3:2.

**cover** — Portrait cover: **Mia** (coral-pink, afro) and **Tara** (sky-blue,
bun) smiling beside a big round **pink frosted cake with lit candles**,
confetti in the air, cosy warm living room. Leave clear headroom at the top
for a title. `--ar 3:4`

**p1** — **Mia**, a small girl with a big afro, stands in her nearly-empty new
living room next to a cardboard **moving box**, turning with a surprised happy
face toward the front **door**; warm afternoon light from a window, a small
potted plant. `--ar 3:2`

**p2** — **Tomo** (green shirt) and **Tara** (blue striped shirt) at the open
**doorway**, arms raised cheering "welcome", holding out a big round **pink
frosted cake with candles**; balloons and confetti, joyful. `--ar 3:2`

**p3** — The round **pink cake on a white plate, neatly cut into 2 equal
halves**, three-quarter view; **Mia** beside it looking delighted and pointing;
cosy room, soft light. `--ar 3:2`

**p4** — The same cake now **cut into 4 equal quarter slices** on the plate;
**Tomo** reaching happily for a slice; warm, celebratory. `--ar 3:2`

**p5** — **Mia, Tomo and Tara** together, each holding a **slice of cake**,
laughing; confetti, warm golden finish. `--ar 3:2`

---

## 5. Workflow

1. Generate a **character sheet** first; lock a seed / reference image.
2. Generate each page with its prompt + the reference (so faces/outfits match).
3. Export, crop to the target ratio, remove any accidental text.
4. Optimise to **WebP** (`cwebp -q 80 in.png -o p1.webp`) and keep < ~150 KB.
5. Name them `cover / p1 … p5` and drop into `public/books/<book-id>/`.
6. Set `imageExt` on the book to match, or leave `"webp"`. Done — the reader
   uses them automatically, SVG stays as the fallback.

To add painted art to another book: create `public/books/<its-id>/`, set
`imageBase`/`imageExt` on that `StoryBook`, and reuse this process.
