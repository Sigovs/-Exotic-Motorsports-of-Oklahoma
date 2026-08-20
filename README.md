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
python3 -m http.server 8145        # or, where there is no python:
npx --yes serve -l 8145 .
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
| `index_detailing.html` | **built** — detailing and protection, `/detailing-and-ceramic-coating-and-window-tinting/` |

Content source for both: the approved `.docx` in `content/` (gitignored) —
`exoticmotook-service page.docx` (195 bullets, 21 slot markers) and
`exoticmotook-detailing-page.docx` (217 bullets, 32 slot markers).

Both pages have been audited line by line against their deck. The audit
script lives in the session scratchpad rather than the repo; what it does is
simple enough to rebuild: strip HTML comments first (copy that survives only
in a comment has not shipped), normalise entities and punctuation, then check
every heading, paragraph and bullet for presence.

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
                   + hero-forecourt-dusk.jpg — the dusk frame the hero loads: three cars
                   on the wet apron outside the lit showroom, 2302x1544, 369 KB.
                   The 2.2 MB uncompressed master of the same frame (service_hero.jpg)
                   was deleted 2026-08-19 at Alex’s request — same pixels, same
                   dimensions. If it is ever wanted back it is in git:
                     git show f3f559d:assets/img/hero/service_hero.jpg > master.jpg
                   + logo.png — the supplied mark. TWO CONSTRAINTS, measured:
                   white-on-transparent (dark grounds only; it vanishes on
                   `paper`), and it needs >= 18rem of width before "OF
                   OKLAHOMA" is drawn at all. That is why it is used in the
                   footer and NOT in the 72px header, where the set Saira
                   lockup stays.
  frames/          frames cut from the client's own master photograph
  service/         REAL client photography, semantically named. Copied out of
                   `all images/` (the raw dump, gitignored) so the build never
                   depends on a folder of CDN hashes with a space in its name.
                   Same rule applied to `svc-built-on.jpg`, which arrived as
                   " What the work is built on.jpg" — leading space and all —
                   and was re-encoded 2310 KB -> 400 KB on the way in.
  marques/         BMW / Mercedes / Audi / Porsche marks. The first three come
                   from the VEGAS project's brand set; the BMW roundel is drawn
                   here because no vector existed. Rendered flat white by CSS
                   filter, so four brand palettes cannot fight each other.
  tmp/             TEMPORARY comp imagery borrowed from other projects — see below
_review/           sliced screenshots for approval (regenerable)
                   the numbered slices predate the 2026-08-19 pass and are ALL
                   STALE — hero, marques, schedule and every image changed
_reference/        live clone of the Design DNA repo (gitignored, see .gitignore)
```

## Conventions

- **Tokens first.** Never hard-code a colour, size, space, radius or duration in
  a page or component — reference a `var(--…)` from `css/tokens.css`.
- **Surfaces, not variants.** A section declares `data-surface="dark|deep|paper"`
  and every component inside follows. There are no `-on-dark` component variants
  by design.
- **Bump `?v=N`** on the CSS/JS links in the HTML after editing them, or the
  browser serves stale styles. Currently at **`?v=76`**.
- **Two type voices only** — Saira (display, tracked uppercase labels) and Inter
  (reading, UI). A third voice needs a systemic job the other two cannot do.
- **One icon set**, drawn inline in `<defs>` at a single 1.5 stroke on one grid.

## Two things the render depends on

**The header is transparent over the hero.** Navigation legibility is carried by
a gradient scrim, not by a solid bar, so it depends on the hero photograph.

Re-measured 2026-08-19 against the dusk frame `hero-forecourt-dusk.jpg`, glyph pixels
only (the text layer diffed against a render with it hidden, so the figure is
the ground the strokes actually cover rather than the worst pixel in a bounding
box): **active nav 15.72:1 · inactive nav 7.44:1 · logo 17.27:1.**

The frame is deep blue sky across the whole header strip — luminance 0.001 to
0.028, no pixel above 0.05 — so every pair gained headroom over the portrait it
replaced (active 10.65, inactive 5.13, logo 10.31). Inactive nav is still the
tightest pair. **Re-measure it if the hero image changes again**, especially to
a frame that is bright along its top edge.

**The hero is one full screen and the photograph is its ground.** The claim,
the action, the short form and the register sit ON the picture, so hero
legibility is a scrim problem at every width. Measured on the composited
render, glyph pixels only: desktop H1 7.74:1, locator 6.81:1, register label
16.47:1; mobile H1 6.04:1, locator 11.32:1.

The desktop figures are what they are because the claim is TOP-aligned with the
form. Bottom-aligned it sat over the wet apron and measured 4.37:1; moving it up
put it across the white Range Rover and it fell to 3.06:1 — still passing the
3:1 large-text floor, but on a two percent margin, which is not a margin. The
horizontal pass was deepened through the 34-66% band instead, and the showroom
kept its light (brightest pixel L=0.98). **Any change to the headline's position
or length moves it onto different pixels — re-measure.** The scrim runs left-to-right on
desktop (the lit showroom keeps its light, the headline side goes dark) and
bottom-up on mobile, where the column is tall and the type sits mid-screen.
**Re-measure both axes if the hero image or the headline length changes.**

**`?static` disables every piece of motion**, which is what it is for — it
exists so a full-page screenshot captures one settled frame. Reviewing motion at
`?static` will always show a page that does not move. Use the plain URL.

## Two things that were silently dead

**`--glow` was never defined at runtime.** `tokens.css` had an unterminated
comment: the `MEASURED COST OF THE GLOW` paragraph sat outside `/* … */`, the
parser tried to read it as declarations, failed, and — hunting for the next
semicolon to recover on — ate `--glow` with it. Every `var(--glow)` was then
invalid at computed-value time, so `background-image` computed to `none` and
**every section glow on the page painted nothing**. It was invisible as a bug
because a missing soft light looks exactly like a design that has no soft light.
Caught by measuring the ground rather than looking at it: darkest pixel and
brightest pixel across a whole section were the same value.

**A negative-z pseudo-element needs its parent to isolate.** `.section` is
`position: relative` with `z-index: auto`, so it establishes no stacking
context and a `z-index: -1` layer joins the nearest ancestor context — behind
the section's own opaque background. `#services` sets `isolation: isolate` for
exactly this reason.

## The sticky stack (sections 06 + 07)

06 pins while 07 rides up over it. Three pieces have to stay in step, and each
one has a reason:

- **The timeline is measured on the wrapper, not on 06.** While 06 is pinned it
  does not move relative to the viewport, so it cannot drive its own view
  timeline. `.sticky-stack` carries `view-timeline-name: --stack`; the four
  lines of 06 animate against that.
- **`.sticky-stack__hold` is the pause.** 07 begins one pixel below 06, so
  without a transparent spacer the chapter is covered the instant it arrives.
  85svh of nothing, which 06 shows through, is the length of the read.
- **07 must not also carry the generic section glow.** That glow has a hard
  top edge at the section's own top. Everywhere else the edge is invisible
  because the ground under it is opaque; here the ground is deliberately
  transparent for its first 58svh, so the glow became the one ungraded thing in
  that region and drew a hard horizontal line across 06's pillars. Killed on
  `.section--overlap` — the fade is already this chapter's light.
- **07's fade carries NO background-color.** A solid colour fills the whole
  element including the area under the gradient, so the fade blended black into
  black and the photograph never showed. The ground below the fade is a second
  image layer sized to the remainder.

- **Each line runs TWO animations on that one timeline** — it arrives, then it
  leaves. The entry fills `both`; the exit fills `forwards` only. With `both` on
  the exit, its from-state (`opacity: 1`) would win over the entry for the whole
  first half of the timeline, because the later animation in the list takes the
  property. The background never animates: only the type comes and goes.

Retune all four together: lengthening the hold moves the stagger percentages,
and changing the fade height changes 07's `padding-block-start`, which is set to
match it exactly so no void opens between the fade and the first line.

Below 60rem the whole mechanism is off — a pin costs a phone its screen for one
passage, and a 58svh fade eats a viewport that has far less to spare.

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

**Temporary comp imagery — now down to ONE use.** `assets/img/tmp/` is borrowed
from other projects. Five of its six uses were replaced with the client's own
photography on 2026-08-19; `tmp-transport.jpg` is the last one standing and it
is still marked as a comp in the render. The other six files in the folder are
now unreferenced and can be deleted once the detailing page is scoped.
Find every use with:

```bash
grep -rn 'img/tmp/' *.html
```

See `assets/img/tmp/README.md` for what each file is and where it came from.

## What the detailing page does NOT have

One of the client’s own slots is deliberately empty:

- **`<<< BEFORE AND AFTER GALLERY >>>`** — asked for twice in the deck, and the
  single most persuasive device a detailing page can carry. **We hold no
  before/after pairs.** This is the highest-value thing to ask Alex for.

Photography generally: the deck places **10 image slots**; six are filled from
the client’s own set. Nothing exists for ceramic coating, PPF, window tint or
dry-ice cleaning, and those four sections run on type alone rather than on a
comp borrowed from another project.

**Outstanding from the client:**

- a **dedicated service phone number** — the page currently shows the main line
  `(405) 633-1142`, marked as a placeholder in the render
- **service hours** — an explicit placeholder, not invented
- ~~photography~~ — **RESOLVED 2026-08-19.** The client's own shots landed and
  five of the six comp images were replaced: a technician at the lift, a
  technician on the refrigerant station, the station itself, a Ferrari V8 bay
  and a carbon engine cover. Only the enclosed-transport frame is still a comp,
  because no photograph of one exists in the set.
- **reviews — READ THIS ONE. NOW ON BOTH PAGES.** The block is built and running on **invented
  copy**. Not a word of it came from a customer. Both of the things that used
  to declare that on the page — the "sample layout" sentence above the cards and
  the dashed red `data-placeholder` rule — have now been removed on request.
  **Nothing visible marks these as fake any more.** The only remaining record
  is this README and the comment in the markup, neither of which a visitor
  reads. **Neither block must go live in this state.** The detailing deck marked a
  `<<< REVIEW SLIDER >>>` slot and supplied nothing to fill it, so that band
  is a layout mockup built on sample copy too — each line written against a
  claim the client already makes, none of them inventing an event, a date, a
  price or a person, and the byline reading “Sample name”. Replace both with
  the real Google feed or delete them. Find every card with:

  ```bash
  grep -n 'class="review' index_service.html
  ```

Every unresolved value still carries the `data-placeholder` attribute, but as
of `?v=30` it no longer draws the dashed red underline — the marking is tonal
only, so an unresolved value is no longer obvious on the page. Audit them with
`grep -n data-placeholder index_service.html` before any launch. Forms are front-end only and not wired.
