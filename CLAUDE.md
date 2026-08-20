# CLAUDE.md — Exotic Motorsports of Oklahoma

Read this before touching anything. It is the file that was missing until
2026-08-20, which is why the first build of the detailing page was made without
opening half the system it was supposed to obey.

---

## Where the design system is

**`C:/____WORK/______GDBURO/design_dna`** — not in this repo, and there is no
local clone. The README's `_reference/design_dna` path does not exist on this
machine. Use the absolute path.

**Load it before any visual decision, in the order its own skill states:**

1. `TASTE.md` — all of it, not the sections you remember
2. `CLAUDE.md` in that repo — the working style. Two rules get broken most:
   never ask yes/no questions, and **never blind `git add -A`**
3. `skills/academic-composition/SKILL.md` — its pass runs BEFORE any surface
   decision, not after the layout exists
4. the other skills the work touches: `anti-patterns`, `spacing-taste`,
   `typography-taste`, `color-taste`, `motion-taste`, `dimensionality`
5. `dialects/` — name the one you are using and why
6. `vault/sites.json` and `vault/reviews/<id>.md` — weight by `rating` and
   `dialectStatus`. Citing an entry is not using it; an entry has earned its
   place only when a nameable thing in the output is different because of it

**Do not modify anything inside `design_dna`.** Its vault holds Alex's
uncommitted work.

Vault entries that have actually informed this build:
`semlerpremium-dk-showroom` (3) — no competing CTAs, remove dealership noise,
elevate the imagery; `semlerpremium-dk` (2) — large headlines and full-width
imagery create presence without crowding; `polestar-com-us` (2) — large imagery
establishes the product, concise headlines explain the proposition;
`semlerpremium-dk-brands-porsche-911-gt3` (3) — data broken into deliberate
groups rather than one dense table, which is why 217 bullets live in disclosure
rows instead of a wall.

---

## What this is

Two static landing pages for one operation. No framework, no bundler, no build
step. **The approved mockup IS the build** — nothing here is throwaway.

| File | |
|---|---|
| `index_service.html` | service and repair, `/service-and-repair/` |
| `index_detailing.html` | detailing and protection, `/detailing-and-ceramic-coating-and-window-tinting/` |

Client: Exotic Motorsports of Oklahoma, 724 Hundred Oaks Drive, Edmond, OK.
Copy: Ivaylo Guenkov / All Auto Network. Design and build: Alex Sigoff.

---

## Hard rules for this repo

**Content comes from the decks and nowhere else.** Both `.docx` live in
`content/`, which is gitignored. Never invent a claim, a caption, a location, a
date or a testimonial. If a fact is missing it stays visibly missing.

**Audit the page against its deck after any copy work.** Strip HTML comments
first — copy that survives only in a comment has not shipped. Both pages have
been audited line by line; the standing result is in README.

**Every number in a report is measured, never asserted.** Contrast is computed
on the composited render at the pixels the glyphs actually cover — not on the
token, and not on the element's bounding box, which runs past the words into
whatever the photograph is doing there.

**Bump `?v=N` on the CSS and JS links after editing them**, on BOTH pages, or
the browser serves stale styles. **Then assert it, never assume it.** `sed`
exits 0 when its pattern matches nothing, so a bump that silently fails breaks
no chain and reports no error — that is how these pages sat at `?v=76` for
nine commits while the README claimed 87, shipping every CSS change behind a
stale cache-buster. Grep both files and compare against the README before
committing:

```bash
grep -o "?v=[0-9]*" index_*.html | sort -u   # must be one value
grep -n "Currently at" README.md             # must be that value
```

**`?static` disables all reveal-on-scroll.** It exists so a full-page
screenshot catches one settled frame. A page viewed with it will never move —
that is not a bug, and it has been reported as one before.

**Stage explicitly.** `git add -A` will sweep in exports another session
dropped in the tree, scratch files and local config. Review `git status` and
account for every line.

---

## Things that have already gone wrong here

Each of these shipped or nearly shipped. They are the failure modes this
project actually has, not hypothetical ones.

- **Two owners of one pseudo-element.** A section glow was put on `::before`,
  which `.texture` already spends on its 87% scrim. The cascade picks one
  silently; body copy fell to roughly 1.4:1.
- **A reveal that starved its own observer.** `clip-path` on the element being
  observed gives an empty intersection rect, so it never becomes visible and
  images below the fold hold layout and paint nothing. It looked correct under
  `?static`, which is exactly how it survived review.
- **Editing the wrong file.** `.phase` lives in `components.css`, not
  `page.css`. The edits applied cleanly and did nothing.
- **A joined control that cannot wrap.** Negative margins collapsing borders
  plus a radius on the first and last of the whole set: fine for three options,
  broken the moment a fourth pushes a row.
- **Chapter order checked, pixels not.** A section-language ledger shows the
  ORDER of masses. It cannot show two full-bleed photographs landing against
  each other, which is a figure-ground fault. Walk the sections and check
  adjacency as well.
- **Compressing a client sentence into a disclosure hint and losing it.** The
  panel still owes the reader the paragraph. This happened nine times on one
  page and eleven on the other.

---

## Verification

There is no test suite. There is a Playwright harness, run from the session
scratchpad against a local server on **8145** (`python -m http.server` does not
work — no Python on this machine; use a node static server).

Before reporting anything done, at 1500 and at 430:

- console errors and failed requests — none, on both pages
- horizontal overflow — zero
- stuck reveals — none that do not resolve after their stagger
- flush section edges — only inside `.section--bleed` and `.texture`
- contrast on every text run that sits over a photograph, measured on glyph
  pixels, across the full range of any drift behind it
- `prefers-reduced-motion` — animations off, and every frame still covers its
  box

---

## Known content debt — read before any launch

- **Reviews are invented on BOTH pages.** The client marked a
  `<<< REVIEW SLIDER >>>` slot and supplied nothing for it. The blocks are
  layout mockups running on sample copy written against claims he already
  makes, with "Sample name" as the byline. The two things that used to declare
  this on the page — a sample-layout strip and a dashed red placeholder rule —
  were both removed at Alex's request. **Nothing visible marks them as fake.**
- No dedicated service or detail-department phone number; both pages show the
  main line.
- No hours for either department.
- No before/after pairs, which is the single most persuasive device a detailing
  page can carry and the client asks for it twice.
- One comp image left: `assets/img/tmp/tmp-transport.jpg`.
