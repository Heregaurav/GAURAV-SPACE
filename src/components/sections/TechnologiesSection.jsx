import { useEffect, useMemo, useRef, useState } from "react";
import {
  Code2,
  Server,
  Cloud,
  ShieldHalf,
  Cpu,
  Wrench,
  Sparkles,
} from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { COLORS, FONT, glassPanel } from "./theme";

const CATEGORIES = [
  {
    icon: Code2,
    label: "Frontend",
    subtitle: "Building responsive user interfaces",
    items: ["React.js", "Next.js"],
  },
  {
    icon: Server,
    label: "Backend",
    subtitle: "APIs, databases & real-time systems",
    items: [
      "Node.js",
      "Express.js",
      "Flask",
      "WebSockets",
      "MongoDB",
      "PostgreSQL",
      "SQL",
      "Prisma",
    ],
  },
  {
    icon: Cloud,
    label: "Cloud & DevOps",
    subtitle: "Deployment & infrastructure",
    items: [
      "AWS",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    icon: ShieldHalf,
    label: "cyberSec",
    subtitle: "Security tools & practices",
    items: [
      "Burp Suite",
      "Wireshark",
      "Nmap",
      "Metasploit",
      "Splunk",
      "OSINT",
      "Web Hacking",
    ],
  },
  {
    icon: Cpu,
    label: "AI / ML",
    subtitle: "Models & intelligent systems",
    items: ["Isolation Forest", "Autoencoder", "RoBERTa", "NLP"],
  },
  {
    icon: Wrench,
    label: "Languages",
    subtitle: "Programming languages I use",
    items: ["C++", "Python", "TypeScript", "Go", "Bash", "PowerShell"],
  },
];

// Phyllotaxis (sunflower-seed) spacing angle in degrees. Placing items at
// i * GOLDEN_ANGLE with a radius that grows as sqrt(i) scatters N points
// across a disc so none of them land on top of each other — no
// collision-detection loop needed, and it never looks like a ring.
const GOLDEN_ANGLE = 137.508;
const GLOBE_SIZE = 150;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function generateStars(count) {
  return Array.from({ length: count }).map(() => ({
    xPct: rand(4, 96),
    yPct: rand(4, 96),
    size: rand(1.2, 2.6),
    duration: rand(2.5, 5.5),
    delay: rand(-5, 0),
  }));
}

// Wireframe "hologram" globe: latitude ellipses sized by the sphere's true
// cross-section at each height (sqrt(r^2 - h^2)), plus a few meridian
// ellipses at different rx to suggest longitude lines curving around it.
function HoloGlobe({ size }) {
  const r = size / 2 - 8;
  const c = size / 2;
  const flatten = 0.3;
  const latOffsets = [-0.72, -0.4, 0, 0.4, 0.72];
  const lonRxFractions = [1, 0.72, 0.36, 0.02];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <filter id="holo-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="rgba(0,212,255,.8)" strokeWidth="1" fill="none" filter="url(#holo-glow)">
        <circle cx={c} cy={c} r={r} strokeWidth="1.3" stroke="rgba(0,212,255,.95)" />
        {latOffsets.map((f, i) => {
          const h = f * r;
          const rx = Math.sqrt(Math.max(r * r - h * h, 0));
          return <ellipse key={`lat-${i}`} cx={c} cy={c + h} rx={rx} ry={rx * flatten} />;
        })}
        {lonRxFractions.map((f, i) => (
          <ellipse key={`lon-${i}`} cx={c} cy={c} rx={r * f} ry={r} />
        ))}
      </g>
    </svg>
  );
}

function FocusField({ category }) {
  const { label, items } = category;

  // Band the pills scatter within — min keeps them clear of the globe +
  // its glow halo, max scales up a bit with item count for busier lists.
  const maxRadius = Math.max(190, Math.min(250, 150 + items.length * 10));
  const minRadius = 130;
  const fieldSize = maxRadius * 2 + 180;

  // One fixed, non-overlapping spot per pill (sunflower layout), plus a
  // small independent drift/rotation range so each pill wobbles on its own
  // timing — recomputed whenever the hovered category changes.
  const placements = useMemo(
    () =>
      items.map((item, i) => {
        const t = (i + 0.5) / items.length;
        const rr = minRadius + (maxRadius - minRadius) * Math.sqrt(t);
        const angle = (i * GOLDEN_ANGLE * Math.PI) / 180;
        return {
          item,
          x: rr * Math.cos(angle),
          y: rr * Math.sin(angle),
          fx0: rand(-9, 9),
          fy0: rand(-9, 9),
          fx1: rand(-9, 9),
          fy1: rand(-9, 9),
          fr0: rand(-5, 5),
          fr1: rand(-5, 5),
          duration: rand(5, 9),
          delay: rand(-9, 0),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  // Stable starfield — generated once and reused across every category so
  // the backdrop doesn't jump each time a different card is hovered.
  const [stars] = useState(() => generateStars(20));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: fieldSize,
          height: fieldSize,
          maxWidth: "110vw",
          maxHeight: "110vw",
        }}
      >
        {/* faint twinkling stars */}
        {stars.map((s, i) => (
          <div
            key={i}
            className="tech-star"
            style={{
              position: "absolute",
              left: `${s.xPct}%`,
              top: `${s.yPct}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "rgba(180,240,255,.9)",
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* scattered, independently floating pills */}
        {placements.map((p) => (
          <div
            key={p.item}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(${p.x}px, ${p.y}px)`,
            }}
          >
            <div style={{ transform: "translate(-50%,-50%)" }}>
              <div
                className="tech-float-item"
                style={{
                  "--fx0": `${p.fx0}px`,
                  "--fy0": `${p.fy0}px`,
                  "--fx1": `${p.fx1}px`,
                  "--fy1": `${p.fy1}px`,
                  "--fr0": `${p.fr0}deg`,
                  "--fr1": `${p.fr1}deg`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "9px 16px",
                    borderRadius: 999,
                    background: "rgba(0,212,255,.14)",
                    border: "1px solid rgba(0,212,255,.4)",
                    color: COLORS.neonBlue,
                    fontSize: 12.5,
                    fontFamily: FONT.mono,
                    whiteSpace: "nowrap",
                    boxShadow: "0 0 18px rgba(0,212,255,.25)",
                  }}
                >
                  {p.item}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* holographic globe, centered in the field */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: GLOBE_SIZE,
              height: GLOBE_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="tech-globe-halo" />
            <div className="tech-globe-spin">
              <HoloGlobe size={GLOBE_SIZE} />
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT.display,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 0.3,
              color: COLORS.textPrimary,
              textShadow: "0 0 14px rgba(0,212,255,.55)",
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* beam connecting the globe down to the platform */}
      <div
        style={{
          width: 3,
          height: 56,
          background: "linear-gradient(to bottom, rgba(0,212,255,.55), rgba(0,212,255,.05))",
        }}
      />
      {/* holographic projection platform */}
      <div
        className="tech-hologram-pulse"
        style={{
          width: 230,
          height: 60,
          marginTop: -8,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0,212,255,.35) 0%, rgba(0,212,255,.12) 45%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

export default function TechnologiesSection() {
  const [hovered, setHovered] = useState(null); // label currently hovered, or null
  const [displayed, setDisplayed] = useState(null); // category kept mounted during exit fade
  const hideTimer = useRef(null);

  useEffect(() => {
    if (hovered) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setDisplayed(CATEGORIES.find((c) => c.label === hovered) || null);
    } else {
      hideTimer.current = setTimeout(() => setDisplayed(null), 420);
    }
    return () => clearTimeout(hideTimer.current);
  }, [hovered]);

  return (
    <SectionWrapper
      id="technologies"
      index="04"
      eyebrow="Toolkit"
      title="Technologies I Work With"
      description="A collection of technologies I've explored through projects, coursework, and continuous learning."
    >
      <style>{`
        @keyframes tech-float {
          0%   { transform: translate(var(--fx0,0px), var(--fy0,0px)) rotate(var(--fr0,0deg)); }
          50%  { transform: translate(var(--fx1,0px), var(--fy1,0px)) rotate(var(--fr1,0deg)); }
          100% { transform: translate(var(--fx0,0px), var(--fy0,0px)) rotate(var(--fr0,0deg)); }
        }
        .tech-float-item {
          animation-name: tech-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes tech-globe-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .tech-globe-spin {
          animation: tech-globe-spin 26s linear infinite;
          transform-origin: 50% 50%;
        }

        @keyframes tech-hologram-pulse {
          0%, 100% { opacity: .55; transform: scale(1); }
          50%      { opacity: .9;  transform: scale(1.06); }
        }
        .tech-globe-halo {
          position: absolute;
          inset: -26px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,.3) 0%, rgba(0,212,255,.08) 45%, transparent 72%);
          filter: blur(6px);
          animation: tech-hologram-pulse 3.2s ease-in-out infinite;
        }
        .tech-hologram-pulse {
          animation: tech-hologram-pulse 3.2s ease-in-out infinite;
        }

        @keyframes tech-star-twinkle {
          0%, 100% { opacity: .15; transform: scale(1); }
          50%      { opacity: .95; transform: scale(1.4); }
        }
        .tech-star {
          animation-name: tech-star-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .tech-card {
          transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease, opacity .35s ease, filter .35s ease;
        }
        .tech-card.is-dimmed {
          opacity: .35;
          filter: blur(1px) saturate(.7);
        }

        .tech-focus-backdrop {
          position: fixed;
          inset: 0;
          z-index: 500;
          pointer-events: none;
          background: rgba(4,6,10,.6);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          opacity: 0;
          transition: opacity .4s ease;
        }
        .tech-focus-backdrop.is-active { opacity: 1; }

        .tech-focus-stage {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%) scale(.85);
          opacity: 0;
          pointer-events: none;
          transition: transform .4s cubic-bezier(.22,1,.36,1), opacity .35s ease;
          z-index: 501;
        }
        .tech-focus-stage.is-active {
          transform: translate(-50%,-50%) scale(1);
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-float-item, .tech-hologram-pulse, .tech-globe-halo, .tech-globe-spin, .tech-star {
            animation: none;
          }
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
          gap: 22,
        }}
      >
        {CATEGORIES.map(({ icon: Icon, label, subtitle, items }) => {
          const isHovered = hovered === label;
          const isDimmed = Boolean(hovered) && !isHovered;

          return (
            <div
              key={label}
              data-reveal
              className={`tech-card${isDimmed ? " is-dimmed" : ""}`}
              style={{
                ...glassPanel,
                padding: 24,
                background: "rgba(10,12,18,.62)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: isHovered
                  ? "1px solid rgba(0,212,255,.25)"
                  : "1px solid rgba(255,255,255,.08)",
                boxShadow: isHovered
                  ? "0 20px 40px rgba(0,0,0,.35),0 0 30px rgba(0,212,255,.15)"
                  : "none",
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: "rgba(0,212,255,.08)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,212,255,.15)",
                    }}
                  >
                    <Icon size={20} color={COLORS.neonBlue} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: FONT.display,
                        fontSize: 18,
                        color: COLORS.textPrimary,
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: COLORS.textFaint,
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {items.map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,.03)",
                      border: "1px solid rgba(255,255,255,.08)",
                      color: "rgba(255,255,255,.82)",
                      fontSize: 12,
                      fontFamily: FONT.mono,
                      transition: ".3s ease",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus overlay: blurred backdrop + centered holographic field, driven by hover state */}
      <div className={`tech-focus-backdrop${hovered ? " is-active" : ""}`} />
      <div className={`tech-focus-stage${hovered ? " is-active" : ""}`}>
        {displayed && <FocusField category={displayed} />}
      </div>
    </SectionWrapper>
  );
}