# Exotic Motorsports of Oklahoma — Service & Detailing Landing Pages

Static, build-free front end. Plain HTML + CSS + vanilla JS — no framework, no
bundler, no build step. The approved mockup **becomes** the build; nothing here
is throwaway.

Client: Exotic Motorsports of Oklahoma, 724 Hundred Oaks Drive, Edmond, OK 73013.
Brief and page copy: Ivaylo Guenkov / All Auto Network. Design and build: Alex Sigoff.

---

## Run it

Partial-free, but images and fonts want a server:

```bash
python3 -m http.server 8145
# -> http://localhost:8145/index_service.html
```

**`?static`** disables reveal-on-scroll so a full-page screenshot captures the
whole page at once — the approval route for these pages is screenshots.

```
http://localhost:8145/index_service.html?static
```

## Pages

| File | Status |
|---|---|
| `index_service.html` | **built** — service and repair, `/service-and-repair/` |
| `index_detailing.html` | not started — detailing, ceramic, PPF, tint |

Content source for both: the two approved `.docx` in `not to git./` (gitignored).

## Structure

```
index_service.html
css/
  tokens.css       design tokens — SINGLE SOURCE OF TRUTH (colour, type, space, motion)
  base.css         reset, page chrome, type roles, .container/.section/.stack
  components.css   buttons, cards, disclosure, spec lists, chips, trust strip,
                   process rail, tiers, media, forms, header, action bar, footer
  page.css         page composition — hero, bleed-split, bands, plates, marques
js/main.js         reveal-on-scroll (opt-in), footer year, disclosure scroll guard
assets/img/
  hero/            the client's supplied hero crops (desktop / mobile / master)
  frames/          frames cut from the client's own master photograph
  tmp/             TEMPORARY comp imagery borrowed from other projects — see below
_review/           sliced screenshots for approval (regenerable)
_reference/        live clone of the Design DNA repo (gitignored, see .gitignore)
```

## Conventions

- **Tokens first.** Never hard-code a colour, size, space, radius or duration in
  a page or component — reference a `var(--…)` from `css/tokens.css`.
- **Surfaces, not variants.** A section declares `data-surface="dark|deep|paper"`
  and every component inside follows. There are no `-on-dark` component variants
  by design.
- **Bump `?v=N`** on the CSS/JS links in the HTML after editing them, or the
  browser serves stale styles. Currently at **`?v=6`**.
- **Two type voices only** — Saira (display, tracked uppercase labels) and Inter
  (reading, UI). A third voice needs a systemic job the other two cannot do.
- **One icon set**, drawn inline in `<defs>` at a single 1.5 stroke on one grid.

## Design DNA

All visual work here is executed inside **[Design DNA](https://github.com/Sigovs/design_dna)**.
Its invariants bind: measured AA contrast, a 14px floor under functional text,
tokenised spacing, a static path for every animation, and the anti-pattern bans.
`_reference/design_dna/` is a local clone for offline reference and is gitignored;
the canonical copy lives at `/Users/alex/Desktop/WORK/design_dna`.

Colour derivation, the measured contrast ratios and the reason each value is what
it is are documented at the top of `css/tokens.css`.

---

## ⚠️ Before this goes to a customer

**Temporary comp imagery.** Everything in `assets/img/tmp/` is borrowed from other
projects to stand in as visual breaks while the client photo dump is outstanding.
None of it shows the Edmond facility, its bays, its technicians or its work.
Find every use with:

```bash
grep -rn 'img/tmp/' *.html
```

See `assets/img/tmp/README.md` for what each file is and where it came from.

**Outstanding from the client:**

- a **dedicated service phone number** — the page currently shows the main line
  `(405) 633-1142`, marked as a placeholder in the render
- **service hours** — an explicit placeholder, not invented
- **photography** — the two remaining dashed blocks in section 07 name the shots:
  a technician at work, and factory-level diagnostic equipment
- **reviews** — the slot is reserved; it fills once the dedicated service GMB has
  collected them

Every unresolved value carries `data-placeholder` and renders with a dashed red
underline, so nothing ships unnoticed. Forms are front-end only and not wired.
