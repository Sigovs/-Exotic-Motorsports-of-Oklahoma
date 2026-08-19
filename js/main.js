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
