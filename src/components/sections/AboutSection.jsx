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
    { icon: Terminal, label: 'Focus', value: 'Software Engineering  Cybersecurity', pos: { x: 370, y: 460 }, anchor: 'bottom' },
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
      description="More than projects and codev — a little about my journey   ,   passions  and hobbies  : the person behind the screen:"
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
               I am a final-year  B.Tech student in Electronics and Communication Engineering at IIIT Dharwad,
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
                style={{
                  display: "block",
                  overflow: "visible",
                }}
              >
                <defs>
                  <path id="flightPath" d={PATH_D} />

                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
                    <stop offset="50%" stopColor={ACCENT} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity="0.2" />
                  </linearGradient>

                  <radialGradient id="bgGlow">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity="0.08" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>

                  <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background glow */}
                <circle
                  cx="350"
                  cy="260"
                  r="260"
                  fill="url(#bgGlow)"
                />

                {/* Radar rings */}
                {[70, 120, 170, 220, 270].map((r) => (
                  <circle
                    key={r}
                    cx="350"
                    cy="260"
                    r={r}
                    fill="none"
                    stroke="rgba(255,255,255,.05)"
                    strokeWidth="1"
                  />
                ))}

                {/* Crosshair */}
                <line
                  x1="350"
                  y1="0"
                  x2="350"
                  y2="520"
                  stroke="rgba(255,255,255,.04)"
                />

                <line
                  x1="0"
                  y1="260"
                  x2="700"
                  y2="260"
                  stroke="rgba(255,255,255,.04)"
                />

                {/* Scan Ring */}
                <circle
                  cx="350"
                  cy="260"
                  r="120"
                  fill="none"
                  stroke={ACCENT}
                  opacity=".15"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="r"
                    values="80;250"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values=".35;0"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Decorative stars */}
                {[
                  [60, 80],
                  [90, 160],
                  [620, 100],
                  [610, 390],
                  [120, 450],
                  [520, 430],
                  [330, 40],
                  [450, 70],
                  [170, 280],
                  [640, 250],
                ].map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="white"
                    opacity=".4"
                  >
                    <animate
                      attributeName="opacity"
                      values=".2;.8;.2"
                      dur={`${2 + i * .4}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}

                {/* Path */}
                <path
                  d={PATH_D}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Vertices */}
                {FACTS.map((f) => (
                  <g key={f.label}>
                    <circle
                      cx={f.pos.x}
                      cy={f.pos.y}
                      r="18"
                      fill={ACCENT}
                      opacity=".08"
                    />

                    <circle
                      cx={f.pos.x}
                      cy={f.pos.y}
                      r="10"
                      fill="none"
                      stroke={ACCENT}
                      strokeWidth="1"
                      opacity=".4"
                    />

                    <circle
                      cx={f.pos.x}
                      cy={f.pos.y}
                      r="5"
                      fill={ACCENT}
                      filter="url(#softGlow)"
                    />

                    <circle
                      cx={f.pos.x}
                      cy={f.pos.y}
                      r="16"
                      fill="none"
                      stroke={ACCENT}
                      opacity=".5"
                    >
                      <animate
                        attributeName="r"
                        values="10;18;10"
                        dur="3.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values=".7;0;.7"
                        dur="3.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}

                {/* Comet */}
                {[0, .06, .12, .18, .24].map((delay, i) => (
                  <circle
                    key={i}
                    r={6 - i}
                    fill={ACCENT}
                    opacity={1 - i * .18}
                    filter="url(#softGlow)"
                  >
                    <animateMotion
                      dur="7s"
                      begin={`${delay}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href="#flightPath" />
                    </animateMotion>
                  </circle>
                ))}

                {/* Labels */}
                {FACTS.map(({ icon: Icon, label, value, pos, anchor }) => {
                  const w = 180;
                  const h = 82;

                  let x = pos.x - w / 2;
                  let y = pos.y - h - 20;

                  if (anchor === "left") {
                    x = pos.x - w - 18;
                    y = pos.y - h / 2;
                  }

                  if (anchor === "right") {
                    x = pos.x + 18;
                    y = pos.y - h / 2;
                  }

                  if (anchor === "bottom") {
                    y = pos.y + 18;
                  }

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

                      <foreignObject
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                      >
                        <div
                          style={{
                            backdropFilter: "blur(18px)",
                            WebkitBackdropFilter: "blur(18px)",
                            background: "rgba(255,255,255,.03)",
                            border: `1px solid ${INK.panelBorder}`,
                            borderRadius: "16px",
                            padding: "14px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "8px",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <Icon
                              size={14}
                              color={ACCENT}
                            />

                            <span
                              style={{
                                fontFamily: FONT.mono,
                                fontSize: "10px",
                                letterSpacing: "1.4px",
                                padding:'4px',
                                color: INK.faint,
                                textTransform: "uppercase",
                              }}
                            >
                              {label}
                            </span>
                          </div>

                          <div
                            style={{
                              color: COLORS.textPrimary,
                              fontWeight: 500,
                              fontSize: "15px",
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
           <div
  style={{
    ...glassPanel,
    position: "relative",
    overflow: "hidden",
    padding: "42px 46px",
    background: INK.panelBg,
    border: `1px solid ${INK.panelBorder}`,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  }}
>
  {/* Background Glow */}
  <div
    style={{
      position: "absolute",
      right: "-80px",
      top: "-80px",
      width: "220px",
      height: "220px",
      borderRadius: "50%",
      background: `${ACCENT}12`,
      filter: "blur(70px)",
      pointerEvents: "none",
    }}
  />

  {/* Quote Mark */}
  <div
    style={{
      position: "absolute",
      top: "18px",
      left: "26px",
      fontSize: "5rem",
      lineHeight: 1,
      fontFamily: "Georgia, serif",
      color: `${ACCENT}30`,
      userSelect: "none",
    }}
  >
    "
  </div>

  <div
    style={{
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginLeft: "20px",
    }}
  >
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: "11px",
        letterSpacing: "4px",
        textTransform: "uppercase",
        color: INK.faint,
      }}
    >
      Beyond the Code
    </span>

    <h3
      style={{
        margin: 0,
        fontSize: "1.1rem",
        fontWeight: 300,
        lineHeight: 1.5,
        color: COLORS.textPrimary,
        maxWidth: "720px",
      }}
    >
      The best part of technology isn't the{" "}
      <span
        style={{
          color: ACCENT,
          fontWeight: 600,
        }}
      >
        code
      </span>
      .
      <br />
      It's discovering what you're capable of{" "}
      <span
        style={{
          color: ACCENT,
          fontWeight: 600,
        }}
      >
        creating.
      </span>
    </h3>
  </div>
</div>

        </div>
      </div>
    </SectionWrapper>
  );
}