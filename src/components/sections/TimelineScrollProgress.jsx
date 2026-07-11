import { useEffect, useRef } from 'react';

/**
 * TimelineScrollProgress
 *
 * A glowy vertical progress rail that tracks scroll position through a
 * timeline container, plus active-item highlighting.
 *
 * Performance notes:
 * - Scroll position is read in a passive listener and all DOM writes happen
 *   inside a single requestAnimationFrame callback (throttled with a ticking
 *   flag), so we never do more than one write per frame.
 * - Progress is applied via `transform: scaleY()` on a GPU-accelerated layer
 *   (not height/top), so it never triggers layout/reflow.
 * - Active-item highlighting uses IntersectionObserver + direct classList
 *   toggles on the row DOM nodes — no setState, so scrolling causes zero
 *   React re-renders.
 */
export default function TimelineScrollProgress({ containerRef, itemRefs }) {
  const fillRef = useRef(null);
  const rafRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const updateProgress = () => {
      ticking = false;
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // "Scan line" sits 60% down the viewport — progress is how far the
      // container has scrolled past that line, as a fraction of its height.
      const scanLine = viewportH * 0.6;
      const distanceScrolled = scanLine - rect.top;
      const progress = distanceScrolled / rect.height;
      const clamped = Math.min(Math.max(progress, 0), 1);

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${clamped})`;
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    // Initial paint
    updateProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Active-row highlighting — direct DOM manipulation, no React state
    const rows = itemRefs.map((r) => r.current).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      {
        root: null,
        // Treat a row as "active" once it crosses a band in the middle
        // of the viewport, rather than the moment it merely appears.
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0,
      }
    );
    rows.forEach((row) => observerRef.current.observe(row));

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [containerRef, itemRefs]);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div className="scroll-progress-bg" />
      <div ref={fillRef} className="scroll-progress-fill" />
    </div>
  );
}

/**
 * Styles are injected once alongside the component. Kept as a plain <style>
 * tag (rather than inline style props) because box-shadow/blur combos and
 * media queries for the responsive offset aren't practical as JS objects.
 */
export function TimelineScrollProgressStyles() {
  return (
    <style>{`
      .scroll-progress-track {
        position: absolute;
        top: 20px; /* start at the first dot center */
        bottom: 0;
        left: 20px; /* align with exp-dot center */
        width: 2px;
        pointer-events: none;
        z-index: 1;
      }

      @media (max-width: 1024px) {
        .scroll-progress-track {
          left: 20px;
        }
      }

      .scroll-progress-bg {
        position: absolute;
        inset: 0;
        width: 2px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
      }

      .scroll-progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 100%;
        border-radius: 999px;
        transform-origin: top;
        transform: scaleY(0);
        background: linear-gradient(180deg, #00d4ff 0%, #00d4ff 85%, rgba(0, 212, 255, 0.2) 100%);
        box-shadow:
          0 0 6px rgba(0, 212, 255, 0.9),
          0 0 16px rgba(0, 212, 255, 0.6),
          0 0 32px rgba(0, 212, 255, 0.35);
        filter: blur(0.3px);
        will-change: transform;
      }

      .exp-row {
        transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      }

      .exp-row .exp-dot {
        transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      }

      .exp-row .exp-panel {
        transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      }

      .exp-row.is-active {
        transform: translateX(2px);
      }

      .exp-row.is-active .exp-dot {
        border-color: #00d4ff !important;
        box-shadow:
          0 0 4px rgba(0, 212, 255, 0.9) inset,
          0 0 14px rgba(0, 212, 255, 0.65),
          0 0 28px rgba(0, 212, 255, 0.35);
        transform: scale(1.18);
      }

      .exp-row.is-active .exp-panel {
        border-color: rgba(0, 212, 255, 0.4) !important;
        box-shadow: 0 0 30px rgba(0, 212, 255, 0.14);
        transform: translateX(6px);
      }

      @media (prefers-reduced-motion: reduce) {
        .scroll-progress-fill,
        .exp-row,
        .exp-row .exp-dot,
        .exp-row .exp-panel {
          transition: none !important;
        }
      }
    `}</style>
  );
}
