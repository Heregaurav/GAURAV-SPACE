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

// Irregular quadrilateral "flight path" — four vertices, one per fact.
const PATH_D = 'M350,90 L520,250 L370,460 L180,270 Z';

export default function AboutSection() {
  const FACTS = [
    { icon: GraduationCap, label: 'Institute', value: 'IIIT Dharwad', pos: { x: 350, y: 90 }, anchor: 'top' },
    { icon: MapPin, label: 'Base', value: 'India', pos: { x: 520, y: 250 }, anchor: 'right' },
    { icon: Terminal, label: 'Focus', value: 'Full-Stack · Cyber Sec', pos: { x: 370, y: 460 }, anchor: 'bottom' },
    { icon: Rocket, label: 'Driven by', value: 'Curiosity to build', pos: { x: 180, y: 270 }, anchor: 'left' },
  ];

  const NOTES = [
    { text: 'Developer ' },
    { text: 'Security Inclined' },
    { text: 'DevOps' },
    { text: 'AI-assisted workflows' },
    { text: 'Leadership ' },
    { text: 'Volleyball — strategy & teamwork' },
  ];

  const SKILLS = ['Software Engineering', 'Cybersecurity', 'DevOps', 'AI Applications'];

  return (
    <SectionWrapper
      id="about"
      index="01"
      eyebrow="About Me"
      title="A little about me"
      description="More than projects and codev — a little about my journey, passions, and the person behind the screen:"
    >
      <style>{`
        @keyframes about2-appear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes about2-vertex-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.35); }
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

        @media (max-width: 900px) {
          .about2-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        data-reveal
        className="about2-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.3fr) minmax(320px,0.85fr)',
          gap: '28px',
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
             Hi ,  Gaurav here  : 
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
              I'm Gaurav Kumar, a final-year B.Tech student in Electronics and Communication Engineering at IIIT Dharwad,
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
              I'm also a former Junior State-level Volleyball player and have represented my college at the Inter-IIIT Sports Meet, experiences that taught me the value of teamwork, leadership, and resilience.
             imp Above all, I'm someone who enjoys learning, embracing challenges, and finding joy in the process of roving every day—both as a developer and as a person.

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
                marginBottom: '4px',
                padding: '40px',
              }}
            >
              Focus &amp; beyond the screen
            </div>
            {NOTES.map((note) => (
              <div className="about2-note-row" key={note.n}>
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: '12px',
                    color: ACCENT,
                    minWidth: '20px',
                  }}
                >
                  {note.n}
                </span>
                <span style={{ fontFamily: FONT.body, fontSize: '14.5px', color: INK.dim }}>
                  {note.text}
                </span>
              </div>
            ))}
        </div>

        {/* ---------------- RIGHT: animated flight-path signature ---------------- */}
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
            }}
          >
            <svg
              viewBox="0 0 700 520"
              width="100%"
              height="auto"
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <path id="flightPath" d={PATH_D} />
                <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* faint concentric backdrop, radar-style */}
              {[240, 180, 120].map((r) => (
                <circle
                  key={r}
                  cx="350"
                  cy="270"
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}

              {/* static outline of the path */}
              <path d={PATH_D} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.25" />

              {/* vertex markers */}
              {FACTS.map((f) => (
                <g key={f.label}>
                  <circle cx={f.pos.x} cy={f.pos.y} r="4" fill={ACCENT} />
                  <circle
                    cx={f.pos.x}
                    cy={f.pos.y}
                    r="10"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="1"
                    opacity="0.5"
                    style={{
                      transformOrigin: `${f.pos.x}px ${f.pos.y}px`,
                      animation: 'about2-vertex-pulse 3.2s ease-in-out infinite',
                      animationDelay: `${f.pos.x % 5 * 0.2}s`,
                    }}
                  />
                </g>
              ))}

              {/* traveling comet with fading trail, looping the quadrilateral forever */}
              {[0, 0.09, 0.18, 0.28, 0.4].map((delay, i) => (
                <circle
                  key={i}
                  r={i === 0 ? 5 : 5 - i}
                  fill={ACCENT}
                  opacity={1 - i * 0.2}
                  filter={i === 0 ? 'url(#softGlow)' : undefined}
                >
                  <animateMotion dur="7s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href="#flightPath" />
                  </animateMotion>
                </circle>
              ))}

              {/* fact labels, locked to the path's coordinate space via foreignObject */}
              {FACTS.map(({ icon: Icon, label, value, pos, anchor }) => {
                const w = 160, h = 74;
                let x = pos.x - w / 2, y = pos.y - h - 14;
                if (anchor === 'right') { x = pos.x + 16; y = pos.y - h / 2; }
                if (anchor === 'left') { x = pos.x - w - 16; y = pos.y - h / 2; }
                if (anchor === 'bottom') { y = pos.y + 16; }
                return (
                  <foreignObject key={label} x={x} y={y} width={w} height={h}>
                    <div
                      style={{
                        fontFamily: FONT.body,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '2px 4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={13} color={INK.faint} />
                        <span
                          style={{
                            fontFamily: FONT.mono,
                            fontSize: '10.5px',
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase',
                            color: INK.faint,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: COLORS.textPrimary,
                          lineHeight: 1.3,
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              ...glassPanel,
              padding: '26px 28px',
              background: INK.panelBg,
              border: `1px solid ${INK.panelBorder}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: 'none',
            }}
          >
            
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}