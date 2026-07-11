import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'button, a, [data-hover], [data-cursor]';

export default function CustomCursor() {
  const coreRef = useRef(null);
  const orbitRef = useRef(null);
  const labelRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch) return undefined; // don't hijack the cursor on touch devices

    const core = coreRef.current;
    const orbit = orbitRef.current;
    const label = labelRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- motion state (refs-only, no React re-renders) ------------------
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX;
    let posY = mouseY;
    let lastMoveTime = performance.now();
    let idle = false;

    let hovered = null; // currently magnetized target element
    let targetW = 14;
    let targetH = 14;
    let targetRadius = '50%';
    let curW = 14;
    let curH = 14;

    const particles = [];
    const MAX_PARTICLES = 90;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = performance.now();
      if (idle) {
        idle = false;
        core.style.animation = 'none';
      }
      // spawn stardust every couple of frames, cheaply
      if (particles.length < MAX_PARTICLES && Math.random() > 0.55) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          r: Math.random() * 1.6 + 0.6,
          life: 1,
          decay: Math.random() * 0.02 + 0.02,
          hue: Math.random() > 0.5 ? '0,212,255' : '180,79,255',
        });
      }
    };

    const findInteractive = (el) => (el && el.closest ? el.closest(INTERACTIVE_SELECTOR) : null);

    const onOver = (e) => {
      const target = findInteractive(e.target);
      if (!target || target === hovered) return;
      hovered = target;
      const rect = target.getBoundingClientRect();
      const computed = getComputedStyle(target);
      const padding = 6; // small breathing room so the ring isn't glued to the edge

      targetW = rect.width + padding;
      targetH = rect.height + padding;
      targetRadius = computed.borderRadius && computed.borderRadius !== '0px' ? computed.borderRadius : '10px';

      core.style.background = 'rgba(0,212,255,0.08)';
      core.style.border = '1.5px solid var(--neon-blue, #00d4ff)';
      core.style.boxShadow = '0 0 18px var(--neon-blue, #00d4ff), 0 0 36px rgba(0,212,255,0.35)';
      orbit.style.opacity = '0';

      const text = target.getAttribute('data-cursor-text');
      if (text) {
        label.textContent = text;
        label.style.opacity = '1';
      }
    };

    const onOut = (e) => {
      const target = findInteractive(e.target);
      if (!target || target !== hovered) return;
      // guard against leaving into a child element still inside the same target
      if (e.relatedTarget && target.contains(e.relatedTarget)) return;
      hovered = null;
      targetW = 14;
      targetH = 14;
      targetRadius = '50%';
      core.style.background = 'var(--neon-blue, #00d4ff)';
      core.style.border = 'none';
      core.style.boxShadow = '0 0 10px var(--neon-blue, #00d4ff), 0 0 20px rgba(0,212,255,0.5)';
      orbit.style.opacity = '1';
      label.style.opacity = '0';
    };

    const onDown = () => {
      core.style.transform += ' scale(0.75)';
      // supernova burst
      const burstCount = 14;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount;
        particles.push({
          x: mouseX,
          y: mouseY,
          r: 2,
          life: 1,
          decay: 0.035,
          hue: '0,212,255',
          vx: Math.cos(angle) * 2.4,
          vy: Math.sin(angle) * 2.4,
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    window.addEventListener('mousedown', onDown);

    let rafId;
    const loop = () => {
      // magnetic pull: snap toward hovered element's center, else raw mouse
      let tx = mouseX;
      let ty = mouseY;
      if (hovered) {
        const rect = hovered.getBoundingClientRect();
        tx = rect.left + rect.width / 2;
        ty = rect.top + rect.height / 2;
      }

      posX += (tx - posX) * (hovered ? 0.25 : 0.18);
      posY += (ty - posY) * (hovered ? 0.25 : 0.18);
      curW += (targetW - curW) * 0.22;
      curH += (targetH - curH) * 0.22;

      core.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
      core.style.width = curW + 'px';
      core.style.height = curH + 'px';
      core.style.borderRadius = targetRadius;

      orbit.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${posX}px, ${posY + curH / 2 + 16}px, 0) translate(-50%, 0)`;

      // idle pulse after 900ms without movement
      if (!idle && performance.now() - lastMoveTime > 900 && !hovered) {
        idle = true;
        core.style.animation = 'cursor-idle-pulse 2.2s ease-in-out infinite';
      }

      // stardust trail render
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      if (!reduceMotion) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= p.decay;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          if (p.vx) p.x += p.vx;
          if (p.vy) p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.hue},${p.life * 0.8})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${p.hue},${p.life})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', resize);
      document.body.style.cursor = prevCursor;
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes cursor-idle-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
        }
        @keyframes cursor-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cs-orbit-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 9998;
          transition: opacity 0.2s ease;
        }
        .cs-orbit-ring span {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--neon-purple, #b44fff);
          box-shadow: 0 0 6px var(--neon-purple, #b44fff);
          top: 0;
          left: 0;
        }
        .cs-orbit-ring .cs-sat-a {
          animation: cursor-orbit-spin 2.4s linear infinite;
          transform-origin: 0 0;
        }
        .cs-orbit-ring .cs-sat-b {
          animation: cursor-orbit-spin 3.6s linear infinite reverse;
          transform-origin: 0 0;
        }
        .cs-orbit-ring .cs-sat-a span { transform: translate(-2px, -22px); }
        .cs-orbit-ring .cs-sat-b span { transform: translate(-2px, 16px); }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997 }} />

      <div
        ref={coreRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'var(--neon-blue, #00d4ff)',
          boxShadow: '0 0 10px var(--neon-blue, #00d4ff), 0 0 20px rgba(0,212,255,0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'background 0.2s ease, box-shadow 0.2s ease, border-radius 0.25s ease',
          willChange: 'transform',
        }}
      />

      <div ref={orbitRef} className="cs-orbit-ring">
        <div className="cs-sat-a"><span /></div>
        <div className="cs-sat-b"><span /></div>
      </div>

      <div
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: 'var(--neon-blue, #00d4ff)',
          background: 'rgba(6,10,20,0.75)',
          border: '1px solid rgba(0,212,255,0.3)',
          padding: '4px 9px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}