import { useEffect, useRef } from 'react';
import { MapPin, GraduationCap, Rocket, Terminal } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { COLORS, FONT, glassPanel } from './theme';

// Neutral, non-neon palette. One restrained warm accent instead of neon glow.
const INK = {
  panelBg: 'rgba(8, 8, 10, 0.5)',
  panelBorder: 'rgba(255,255,255,0.09)',
  hairline: 'rgba(255,255,255,0.10)',
  dim: 'rgba(255,255,255,0.62)',
  faint: 'rgba(255,255,255,0.40)',
};
const ACCENT = '#D9CFBE'; // muted warm platinum — the single signature color
const ACCENT_COOL = '#8FA8C4'; // secondary cool accent, used sparingly for depth

export default function AboutSection() {
  const FACTS = [
    { icon: GraduationCap, label: 'Institute', value: 'IIIT Dharwad', angle: -90 },
    { icon: MapPin, label: 'Base', value: 'India', angle: 0 },
    { icon: Terminal, label: 'Focus', value: 'Software Engineering · Cybersecurity', angle: 90 },
    { icon: Rocket, label: 'Driven by', value: 'Curiosity to build', angle: 180 },
  ];

  const NOTES = [
    { text: 'Developer' },
    { text: 'Security inclined' },
    { text: 'DevOps' },
    { text: 'AI-assisted workflows' },
    { text: 'Leadership' },
    { text: 'Volleyball — strategy & teamwork' },
  ];

  const SKILLS = ['Software Engineering', 'Cybersecurity', 'DevOps', 'AI Applications'];

  // ---- orbit geometry ----
  // An ellipse centered in the viewBox. Vertices sit at fixed angles on the
  // ellipse; the comet travels the same ellipse continuously, its speed
  // governed by scroll.
  const CX = 350, CY = 280, RX = 250, RY = 170;
  const pointOnOrbit = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: CX + RX * Math.cos(rad), y: CY + RY * Math.sin(rad) };
  };
  const orbitPathD = `M ${CX + RX},${CY} A ${RX},${RY} 0 1 1 ${CX - RX},${CY} A ${RX},${RY} 0 1 1 ${CX + RX},${CY}`;

  // ---- scroll-driven comet ----
  // The comet (and its trailing dots) only advance while THIS section is
  // in view and the page is being scrolled downward. Scrolling up, or not
  // scrolling at all, freezes it in place instead of reversing or auto-looping.
  // Uses a rAF loop reading scrollY every frame (rather than only the native
  // `scroll` event) so it keeps working with smooth-scroll libraries that
  // throttle or suppress native scroll events.
  const wrapRef = useRef(null);
  const cometRefs = useRef([]);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const ORBIT_LEN = 2 * Math.PI * Math.sqrt((RX * RX + RY * RY) / 2); // approx ellipse circumference
    const TRAIL_GAP = 14;
    const SPEED = 0.9;

    let progress = 0;
    let lastY = window.scrollY;
    let rafId;

    const angleAtDistance = (dist) => (dist / ORBIT_LEN) * 360;

    const render = () => {
      cometRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const dist = ((progress - i * TRAIL_GAP) % ORBIT_LEN + ORBIT_LEN) % ORBIT_LEN;
        const pt = pointOnOrbit(angleAtDistance(dist));
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
      });
    };

    const tick = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (isVisibleRef.current && delta !== 0) {
        // scrolling down advances the comet, scrolling up reverses it —
        // only while the section is visible; standing still leaves it in place
        progress += delta * SPEED;
        render();
      }
      lastY = y;
      rafId = requestAnimationFrame(tick);
    };

    render(); // set initial position
    rafId = requestAnimationFrame(tick);

    let observer;
    if (wrapRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
        },
        { threshold: 0.15 }
      );
      observer.observe(wrapRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <SectionWrapper
      id="about"
      index="01"
      eyebrow="About Me"
      title="A little about me"
      description="More than projects and code — a little about my journey, passions and hobbies: the person behind the screen."
    >
      <style>{`
        @keyframes about2-appear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbit-twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.65; }
        }
        @keyframes orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .about2-fade { opacity: 0; animation: about2-appear 0.7s ease forwards; }
        .about2-fade.d1 { animation-delay: 0.05s; }
        .about2-fade.d2 { animation-delay: 0.15s; }

        .about2-skill-link {
          color: ${INK.dim};
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .about2-skill-link:hover {
          color: ${COLORS.textPrimary};
          border-color: ${ACCENT};
        }

        .about2-note-row {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding: 12px 0;
          border-top: 1px solid ${INK.hairline};
        }
        .about2-note-row:first-child { border-top: none; }

        .about2-svg-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .orbit-starfield {
          animation: orbit-rotate 160s linear infinite;
          transform-origin: 350px 280px;
        }
        .orbit-star {
          animation: orbit-twinkle 4s ease-in-out infinite;
        }

        @media (max-width: 900px) {
          .about2-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-starfield { animation: none; }
          .orbit-star { animation: none; opacity: 0.35; }
        }
      `}</style>

      <div
        ref={wrapRef}
        data-reveal
        className="about2-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '28px',
          marginBottom: '20px',
          alignItems: 'start',
        }}
      >
        {/* ---------------- LEFT: About text ---------------- */}
        <div
          className="about2-fade d1"
          style={{
            ...glassPanel,
            padding: '52px 44px',
            background: INK.panelBg,
            border: `1px solid ${INK.panelBorder}`,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: '12px',
              letterSpacing: '2px',
              color: INK.faint,
              textTransform: 'uppercase',
              marginBottom: '22px',
            }}
          >
            Building meaningful software through curiosity, creativity, and continuous learning.
          </div>

          <h3
            style={{
              margin: 0,
              fontFamily: FONT.display,
              fontSize: 'clamp(20px, 3.6vw, 22px)',
              color: COLORS.textPrimary,
              lineHeight: 1.14,
              letterSpacing: '-0.3px',
              fontWeight: 600,
            }}
          >
            Hi, Gaurav here:
          </h3>

          <div style={{ display: 'grid', gap: '20px', marginTop: '26px' }}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontSize: '16px',
                lineHeight: 1.9,
                color: INK.dim,
              }}
            >
              I am a final-year B.Tech student in Electronics and Communication Engineering at IIIT Dharwad,
              where I'm also pursuing a Minor in Cybersecurity. My curiosity for technology gradually led me from electronics to software engineering,
              where I discovered a passion for building secure, scalable applications and solving real-world problems.
              I'm particularly interested in full-stack development, cybersecurity, AI, and problem solving.
              As a Top 5% learner on TryHackMe, I enjoy understanding how systems work, exploring vulnerabilities, and learning how to build more secure software.
              I believe in continuous learning and love diving deep into topics that genuinely interest me.
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontSize: '16px',
                lineHeight: 1.9,
                color: INK.dim,
              }}
            >
              Beyond coding, I'm the Co-Lead of the Dynamight Dance Club at IIIT Dharwad, where I've helped organize events and lead our team in inter-college competitions.
              I'm also a former Junior State-level Volleyball player and have represented my college at the Inter-IIIT Sports Meet — experiences that taught me the value of teamwork, leadership, and resilience.
              Above all, I'm someone who enjoys learning, embracing challenges, and finding joy in the process of growing every day — both as a developer and as a person.
            </p>
          </div>

          <div
            style={{
              marginTop: '30px',
              paddingLeft: '18px',
              borderLeft: `2px solid ${ACCENT}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: FONT.body,
                fontStyle: 'italic',
                fontSize: '15.5px',
                lineHeight: 1.8,
                color: INK.dim,
              }}
            >
              Always learning, always building, and always excited for the next challenge.
            </p>
          </div>

          <div
            style={{
              marginTop: '34px',
              paddingTop: '24px',
              borderTop: `1px solid ${INK.hairline}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px 18px',
              fontFamily: FONT.mono,
              fontSize: '12.5px',
              letterSpacing: '0.4px',
            }}
          >
            {SKILLS.map((s, i) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <span className="about2-skill-link">{s}</span>
                {i < SKILLS.length - 1 && (
                  <span style={{ color: INK.faint }}>／</span>
                )}
              </span>
            ))}
          </div>

          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: '11px',
              letterSpacing: '1.6px',
              textTransform: 'uppercase',
              color: INK.faint,
              marginTop: '34px',
              marginBottom: '4px',
            }}
          >
            Focus &amp; beyond the screen
          </div>
          {NOTES.map((note, i) => (
            <div className="about2-note-row" key={note.text}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: '12px',
                  color: ACCENT,
                  minWidth: '20px',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: FONT.body, fontSize: '14.5px', color: INK.dim }}>
                {note.text}
              </span>
            </div>
          ))}
        </div>

        {/* ---------------- RIGHT: animated orbit signature ---------------- */}
        <div className="about2-fade d2" style={{ display: 'grid', gap: '22px' }}>
          <div
            style={{
              ...glassPanel,
              padding: '50px',
              background: INK.panelBg,
              border: `1px solid ${INK.panelBorder}`,
              backdropFilter: 'blur(45px)',
              WebkitBackdropFilter: 'blur(84px)',
              boxShadow: 'none',
              overflow: 'hidden',
            }}
          >
            <div className="about2-svg-wrap">
              <svg
                viewBox="0 0 700 560"
                width="100%"
                height="auto"
                style={{
                  display: 'block',
                  maxWidth: '560px',
                  overflow: 'visible',
                }}
              >
                <defs>
                  <radialGradient id="coreGlow">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.9" />
                    <stop offset="40%" stopColor={ACCENT} stopOpacity="0.25" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>

                  <radialGradient id="bgGlow">
                    <stop offset="0%" stopColor={ACCENT_COOL} stopOpacity="0.10" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>

                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.15" />
                    <stop offset="50%" stopColor={ACCENT} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0.15" />
                  </linearGradient>

                  <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Ambient background glow */}
                <circle cx={CX} cy={CY} r="280" fill="url(#bgGlow)" />

                {/* Slow-rotating decorative starfield */}
                <g className="orbit-starfield">
                  {Array.from({ length: 22 }).map((_, i) => {
                    const angle = (i / 22) * 360 + (i % 2 === 0 ? 12 : 0);
                    const r = 210 + ((i * 37) % 90);
                    const rad = (angle * Math.PI) / 180;
                    const x = CX + r * Math.cos(rad);
                    const y = CY + r * Math.sin(rad) * (RY / RX);
                    return (
                      <circle
                        key={i}
                        className="orbit-star"
                        cx={x}
                        cy={y}
                        r={i % 3 === 0 ? 1.6 : 1}
                        fill={ACCENT}
                        style={{ animationDelay: `${(i % 7) * 0.5}s` }}
                      />
                    );
                  })}
                </g>

                {/* Concentric orbit rings */}
                {[0.55, 0.7, 0.85, 1].map((s) => (
                  <ellipse
                    key={s}
                    cx={CX}
                    cy={CY}
                    rx={RX * s}
                    ry={RY * s}
                    fill="none"
                    stroke="rgba(255,255,255,.06)"
                    strokeWidth="1"
                  />
                ))}

                {/* Central core (the "planet") */}
                <circle cx={CX} cy={CY} r="60" fill="url(#coreGlow)" />
                <circle cx={CX} cy={CY} r="7" fill={ACCENT} filter="url(#softGlow)" />
                <circle cx={CX} cy={CY} r="16" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.35" />

                {/* Orbit path the comet travels */}
                <path
                  d={orbitPathD}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Vertices — one per fact, placed on the orbit */}
                {FACTS.map((f) => {
                  const pos = pointOnOrbit(f.angle);
                  return (
                    <g key={f.label}>
                      <circle cx={pos.x} cy={pos.y} r="18" fill={ACCENT} opacity=".08" />
                      <circle cx={pos.x} cy={pos.y} r="10" fill="none" stroke={ACCENT} strokeWidth="1" opacity=".4" />
                      <circle cx={pos.x} cy={pos.y} r="5" fill={ACCENT} filter="url(#softGlow)" />
                      <circle cx={pos.x} cy={pos.y} r="16" fill="none" stroke={ACCENT} opacity=".5">
                        <animate attributeName="r" values="10;18;10" dur="3.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values=".7;0;.7" dur="3.5s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                })}

                {/* Comet — position driven entirely by scroll, see useEffect above */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle
                    key={i}
                    ref={(el) => (cometRefs.current[i] = el)}
                    r={6 - i}
                    fill={ACCENT}
                    opacity={1 - i * 0.18}
                    filter="url(#softGlow)"
                  />
                ))}

                {/* Labels */}
                {FACTS.map(({ icon: Icon, label, value, angle }) => {
                  const pos = pointOnOrbit(angle);
                  const w = 210;
                  const h = 88;
                  let x = pos.x - w / 2;
                  let y = pos.y - h - 22;

                  if (angle === 0) { x = pos.x + 22; y = pos.y - h / 2; }
                  if (angle === 180) { x = pos.x - w - 22; y = pos.y - h / 2; }
                  if (angle === 90) { y = pos.y + 22; }

                  return (
                    <g key={label}>
                      <line
                        x1={pos.x}
                        y1={pos.y}
                        x2={x + w / 2}
                        y2={y + h / 2}
                        stroke={ACCENT}
                        opacity=".18"
                      />
                      <foreignObject x={x} y={y} width={w} height={h}>
                        <div
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: '100%',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            background: 'rgba(255,255,255,.035)',
                            border: `1px solid ${INK.panelBorder}`,
                            borderRadius: '16px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icon size={14} color={ACCENT} />
                            <span
                              style={{
                                fontFamily: FONT.mono,
                                fontSize: '10px',
                                letterSpacing: '1.4px',
                                color: INK.faint,
                                textTransform: 'uppercase',
                              }}
                            >
                              {label}
                            </span>
                          </div>
                          <div
                            style={{
                              color: COLORS.textPrimary,
                              fontWeight: 500,
                              fontSize: '14.5px',
                              lineHeight: 1.4,
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div
            style={{
              ...glassPanel,
              position: 'relative',
              overflow: 'hidden',
              padding: '42px 46px',
              background: INK.panelBg,
              border: `1px solid ${INK.panelBorder}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-80px',
                top: '-80px',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background: `${ACCENT}12`,
                filter: 'blur(70px)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '26px',
                fontSize: '5rem',
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
                color: `${ACCENT}30`,
                userSelect: 'none',
              }}
            >
              "
            </div>

            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginLeft: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: '11px',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: INK.faint,
                }}
              >
                Beyond the Code
              </span>

                <h3
                  style={{
                    margin: '0 auto',
                    fontSize: '1.1rem',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    color: COLORS.textPrimary,
                    maxWidth: '720px',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  The best part of technology isn't the{' '}
                  <span style={{ color: ACCENT, fontWeight: 600 }}>code</span>.
                  <br />
                  It's discovering what you're capable of{' '}
                  <span style={{ color: ACCENT, fontWeight: 600 }}>creating</span>.
                </h3>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}