/* ============================================================================
   Shared page behaviour. Deliberately small.

   The static build stands alone: nothing here is required to read, navigate
   or submit the page. Reveal-on-scroll is OPT-IN — the `js-reveal` class that
   hides elements is added by this file, so if the script never runs, or the
   visitor has asked for reduced motion, everything is simply visible.
   ========================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ?static disables reveal-on-scroll so a full-page screenshot captures the
   whole page at once. The approval route for this mockup is screenshots, and
   a capture is a stoppable frame — it has to be a designed one. */
const staticCapture = new URLSearchParams(location.search).has('static');

/* ---- footer year --------------------------------------------------------- */
for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}

/* ---- reveal on scroll ---------------------------------------------------- */
const targets = document.querySelectorAll('[data-reveal]');

if (targets.length && !reduceMotion && !staticCapture && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

  for (const el of targets) io.observe(el);

  /* Anything already inside the first screen is shown immediately rather than
     animated — the opening screen should never arrive in pieces. */
  requestAnimationFrame(() => {
    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    }
  });
}

/* ---- disclosure cards ----------------------------------------------------
   <details> already works without JS. This only smooths the open transition
   and guarantees the clicked summary keeps its position, so no neighbouring
   card can slide under a stationary pointer (anti-patterns U14).
--------------------------------------------------------------------------- */
if (!reduceMotion) {
  for (const disc of document.querySelectorAll('.disc')) {
    disc.addEventListener('toggle', () => {
      if (!disc.open) return;
      const top = disc.getBoundingClientRect().top;
      if (top < 0) window.scrollBy({ top, behavior: 'auto' });
    });
  }
}


/* ---- HEADINGS: a line at a time, from the side ----------------------------
   Split AFTER layout so the browser's own line breaks are what get wrapped —
   `text-wrap: balance` and every measure still decide where the text turns.
   Words are wrapped, measured by their line box top, regrouped, and the
   heading is rebuilt as one clip window per line. Inline children (the hero's
   locator span) keep their class, because a display:block child always starts
   its own line and can therefore be attributed cleanly.

   The static path is the absence of this function: without JS, or under
   reduced motion, or with ?static, headings are untouched markup.
--------------------------------------------------------------------------- */
const HEADINGS = 'h1.hero__title, h2.t-h2, h3.t-h3.marque__name';

function splitIntoLines(el) {
  if (el.dataset.split === 'done') return;

  /* Remember the original so a resize can re-split from clean markup. */
  if (el.dataset.originalHtml === undefined) el.dataset.originalHtml = el.innerHTML;
  el.innerHTML = el.dataset.originalHtml;

  /* 1 · wrap every word, remembering which element it came from */
  const words = [];
  const walk = (node, source) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
          const w = document.createElement('span');
          w.textContent = part;
          w.style.display = 'inline-block';
          words.push({ el: w, source });
          frag.appendChild(w);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child, child);
      }
    }
  };
  walk(el, el);
  if (!words.length) return;

  /* 2 · group by line box */
  const lines = [];
  let top = null;
  for (const w of words) {
    const t = Math.round(w.el.getBoundingClientRect().top);
    if (top === null || Math.abs(t - top) > 3 || (lines.length && lines.at(-1).source !== w.source)) {
      lines.push({ source: w.source, words: [] });
      top = t;
    }
    lines.at(-1).words.push(w.el.textContent);
  }

  /* 3 · rebuild as one clip window per line */
  el.innerHTML = '';
  lines.forEach((line, i) => {
    const text = line.words.join(' ');
    const outer = document.createElement('span');
    outer.className = 'ln';
    /* only pay for the descender allowance where the line actually has one */
    if (/[gjpqy,;$(){}\[\]]/.test(text)) outer.classList.add('ln--desc');
    outer.style.setProperty('--ln-delay', (i * 85) + 'ms');

    const inner = document.createElement('span');
    inner.className = 'ln__i';
    if (line.source !== el && line.source.className) inner.classList.add(...line.source.classList);
    inner.textContent = text;

    outer.appendChild(inner);
    el.appendChild(outer);
  });

  el.classList.add('has-lines');
  el.dataset.split = 'done';
}

if (!reduceMotion && !staticCapture && 'IntersectionObserver' in window) {
  const heads = [...document.querySelectorAll(HEADINGS)];

  const runSplit = () => {
    for (const h of heads) { h.dataset.split = ''; splitIntoLines(h); }
  };
  runSplit();

  /* Each split heading observes itself, so its lines start when IT arrives
     rather than when whatever block it happens to sit in does. */
  const headIo = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      headIo.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  for (const h of heads) headIo.observe(h);
  requestAnimationFrame(() => {
    for (const h of heads) {
      if (h.getBoundingClientRect().top < window.innerHeight * 0.9) {
        h.classList.add('is-visible');
        headIo.unobserve(h);
      }
    }
  });

  /* Re-split on width change only: a height change is the address bar, not a
     reflow, and re-splitting on it would restart headings mid-scroll. */
  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const seen = heads.filter((h) => h.classList.contains('is-visible'));
      runSplit();
      for (const h of seen) h.classList.add('is-visible');
    }, 180);
  });
}


/* ---- PARAGRAPHS: rise into place -----------------------------------------
   Every reading paragraph on the page, staggered against its siblings so a
   passage arrives as one movement. Marked up by JS rather than by hand so the
   static build has no motion classes sitting in the markup doing nothing.
--------------------------------------------------------------------------- */
if (!reduceMotion && !staticCapture && 'IntersectionObserver' in window) {
  /* NOT the copy inside a disclosure panel. A closed <details> never
     intersects, so its paragraphs would be observed, never triggered, and left
     at opacity 0 — the visitor opens the card and finds it empty. The panel
     already carries its own open/close movement; a second staggered rise
     inside it would be a competing temporal idea even if it did fire. */
  const paras = [...document.querySelectorAll(
    '.prose p, p.t-lead, p.t-body, .marque__text, .card__text, .disc__hint, p.t-sm'
  )].filter((el) => !el.closest('.disc__panel'));

  const riseIo = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      riseIo.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  /* the stagger is counted within a parent, so two columns start together
     rather than one waiting for the other to finish */
  const seen = new Map();
  for (const p of paras) {
    const key = p.parentElement;
    const i = (seen.get(key) ?? 0);
    seen.set(key, i + 1);
    p.classList.add('rise');
    p.style.setProperty('--rise-delay', Math.min(i, 4) * 70 + 'ms');
    riseIo.observe(p);
  }

  requestAnimationFrame(() => {
    for (const p of paras) {
      if (p.getBoundingClientRect().top < window.innerHeight * 0.9) {
        p.classList.add('is-visible');
        riseIo.unobserve(p);
      }
    }
  });
}


/* ---- IMAGES: the frame opens ---------------------------------------------
   Every photographic frame on the page except the hero. The hero is excluded
   deliberately: the first screen must not arrive in pieces, and a shutter on
   the opening photograph would make the page's own identification wait on an
   animation (motion-judgment — comprehension never waits on choreography).
--------------------------------------------------------------------------- */
if (!reduceMotion && !staticCapture && 'IntersectionObserver' in window) {
  const frames = document.querySelectorAll(
    '.media, .bleed-split__media, .band__media'
  );

  const openIo = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      openIo.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.15 });

  for (const f of frames) {
    f.classList.add('open-frame');
    openIo.observe(f);
  }

  requestAnimationFrame(() => {
    for (const f of frames) {
      if (f.getBoundingClientRect().top < window.innerHeight * 0.9) {
        f.classList.add('is-visible');
        openIo.unobserve(f);
      }
    }
  });
}



/* ---- REVIEWS CAROUSEL -----------------------------------------------------
   Progressive enhancement over a track that already scrolls. Everything here
   only ADDS controls: without it the visitor swipes or tabs, with it they can
   also click.

   The dots are one per REACHABLE SNAP POSITION, not one per card. A track
   that shows two cards of three has three card offsets but only two places it
   can actually stop — the last card's offset is past the end and the browser
   clamps it. Counting cards would draw a dot that can never be reached and can
   never be marked current. The positions are measured from the DOM and
   re-measured on resize, so the control can never disagree with the layout.
--------------------------------------------------------------------------- */
{
  const track = document.getElementById('reviews-track');
  const dotsBox = document.querySelector('[data-rev-dots]');
  const prev = document.querySelector('[data-rev-prev]');
  const next = document.querySelector('[data-rev-next]');

  if (track && dotsBox && prev && next) {
    const cards = [...track.children];
    let stops = [];

    const measure = () => {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      stops = [];
      cards.forEach((c) => {
        const at = Math.min(c.offsetLeft - track.offsetLeft, max);
        /* two cards that clamp to the same stop are one stop */
        if (!stops.length || Math.abs(at - stops[stops.length - 1]) > 2) stops.push(at);
      });

      dotsBox.textContent = '';
      stops.forEach((at, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel__dot';
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', 'Reviews, view ' + (i + 1) + ' of ' + stops.length);
        d.addEventListener('click', () => {
          track.scrollTo({ left: at, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        dotsBox.appendChild(d);
      });

      /* nothing to drive — the controls leave rather than sit there inert */
      track.closest('[data-carousel]')?.toggleAttribute('data-carousel-idle', stops.length < 2);
    };

    const current = () => {
      let active = 0, best = Infinity;
      stops.forEach((at, i) => {
        const d = Math.abs(at - track.scrollLeft);
        if (d < best) { best = d; active = i; }
      });
      return active;
    };

    /* Which view is current is read off the scroll position rather than
       counted in a variable, so a swipe and a click stay in agreement. */
    const sync = () => {
      const active = current();
      [...dotsBox.children].forEach((d, i) => d.setAttribute('aria-selected', String(i === active)));
      prev.disabled = active === 0;
      next.disabled = active === stops.length - 1;
    };

    const step = (dir) => {
      const at = stops[Math.min(stops.length - 1, Math.max(0, current() + dir))];
      if (at !== undefined) track.scrollTo({ left: at, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));

    let raf;
    track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', () => { measure(); sync(); });
    measure();
    sync();
  }
}
