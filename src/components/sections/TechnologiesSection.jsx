import { useEffect, useRef, useState } from "react";
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

// One full orbit revolution, in seconds. Kept constant across cards so the
// motion feels consistent regardless of how many skills a category has.
const ORBIT_DURATION = 26;

function FocusOrbit({ category }) {
  const { icon: Icon, label, subtitle, items } = category;
  // Radius must always clear the center card (230px wide, so ~115px half-width)
  // plus room for a pill — otherwise low-item categories place tags behind the card.
  const radius = Math.max(190, Math.min(240, 150 + items.length * 9));
  const stageSize = radius * 2 + 170;

  return (
    <div
      style={{
        position: "relative",
        width: stageSize,
        height: stageSize,
        maxWidth: "120vw",
        maxHeight: "120vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* faint dashed orbit path */}
      <div
        style={{
          position: "absolute",
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          border: "1px dashed rgba(255,255,255,.10)",
        }}
      />

      {/* rotating ring — each child counter-rotates to stay upright */}
      <div
        className="tech-orbit-ring"
        style={{ position: "absolute", inset: 0, animationDuration: `${ORBIT_DURATION}s` }}
      >
        {items.map((item, i) => {
          const angle = (360 / items.length) * i;
          return (
            <div
              key={item}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translateX(${radius}px)`,
              }}
            >
              <div
                className="tech-orbit-item-inner"
                style={{
                  animationDuration: `${ORBIT_DURATION}s`,
                  transform: `translate(-50%,-50%) rotate(${-angle}deg)`,
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
                  {item}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* center card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 150,
          padding: "30px 24px",
          borderRadius: 20,
          background: "rgba(8,10,16,.88)",
          border: "1px solid rgba(0,212,255,.3)",
          boxShadow: "0 0 50px rgba(0,212,255,.2), 0 30px 60px rgba(0,0,0,.5)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            background: "rgba(0,212,255,.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0,212,255,.3)",
          }}
        >
          <Icon size={16} color={COLORS.neonBlue} />
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
          }}
        >
          {label}
        </div>

      </div>
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
        @keyframes tech-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tech-orbit-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .tech-orbit-ring { animation-name: tech-orbit-spin; animation-timing-function: linear; animation-iteration-count: infinite; }
        .tech-orbit-item-inner { animation-name: tech-orbit-spin-reverse; animation-timing-function: linear; animation-iteration-count: infinite; }

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
          .tech-orbit-ring, .tech-orbit-item-inner { animation: none; }
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

      {/* Focus overlay: blurred backdrop + centered orbit, driven by hover state */}
      <div className={`tech-focus-backdrop${hovered ? " is-active" : ""}`} />
      <div className={`tech-focus-stage${hovered ? " is-active" : ""}`}>
        {displayed && <FocusOrbit category={displayed} />}
      </div>
    </SectionWrapper>
  );
}