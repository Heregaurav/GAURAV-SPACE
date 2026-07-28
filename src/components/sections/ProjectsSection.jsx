import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Code2,
  ShieldCheck,
  Rocket,
  Boxes,
  Cpu,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  RotateCcw,
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { COLORS, FONT, glassPanel } from './theme';

const PROJECTS = [
  {
    icon: ShieldCheck,
    title: 'Tracely AI',
    tag: 'Cybersecurity · UEBA',
    description:
      'An AI-powered User & Entity Behavior Analytics (UEBA) platform that detects insider threats using behavioral anomaly detection. Built with Isolation Forest and Autoencoder models on the CERT insider-threat dataset, featuring a real-time dashboard for alerts, risk scoring, timelines, and security analytics.',
    stack: [
      'Python',
      'React',
      'Flask',
      'Isolation Forest',
      'Autoencoder',
      'CERT Dataset',
    ],
    links: {
      code: 'https://github.com/Heregaurav/Tracely-AI',
      live: 'https://tracely-ai.vercel.app/',
    },
    featured: true,
  },
  {
    icon: Rocket,
    title: 'Inkwell',
    tag: 'Full Stack · Cloud Native',
    description:
      'An AI-powered platform for readers and writers to publish articles, engage in discussions, and explore knowledge-driven content. Includes AI-generated summaries, key-point extraction, exam-focused insights, and a scalable cloud-native infrastructure deployed on AWS using Docker, Kubernetes (EKS), and Terraform.',
    stack: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Socket.IO',
      'Docker',
      'Kubernetes',
      'AWS',
      'Terraform',
    ],
    links: {
      code: 'https://github.com/Heregaurav/inkwell',
      live: 'https://myinkwell.vercel.app/',
    },
    featured: true,
  },
  {
    icon: Boxes,
    title: 'Guardian AI',
    tag: 'AI · Content Moderation',
    description:
      'A real-time intelligent chat platform that leverages a fine-tuned RoBERTa model to detect abusive, toxic, and harmful messages. Includes an admin dashboard for monitoring flagged conversations while maintaining privacy-focused moderation and secure handling of user data.',
    stack: ['Python', 'RoBERTa', 'NLP', 'React', 'Real-time Chat'],
    links: {
      code: 'https://github.com/Heregaurav/Guardian-AI',
      live: '#',
    },
    featured: true,
  },
  {
    icon: MessageCircle,
    title: 'VOID',
    tag: 'Anonymous Chat App',
    description:
      'A secure real-time anonymous chatting platform built with Socket.IO, enabling instant peer-to-peer conversations without requiring user identities. Features live messaging, room-based communication, responsive UI, and efficient WebSocket-based event handling for a seamless chat experience.',
    stack: ['React', 'Node.js', 'Express', 'Socket.IO', 'MongoDB'],
    links: {
      code: 'https://github.com/Heregaurav/VOID',
      live: 'https://void25.vercel.app',
    },
    featured: true,
  },
  {
    icon: Cpu,
    title: 'LPSim',
    tag: 'CUDA · GPU Computing',
    description:
      'A high-performance multi-GPU traffic simulation system inspired by the TRC 2024 LPSim research. Built using CUDA and C++, the simulator models large-scale traffic propagation with parallel vehicle updates, balanced graph partitioning, and multi-GPU synchronization. Includes benchmarking tools, real-world Berkeley traffic datasets, and performance visualization for scalable traffic analysis.',
    stack: [
      'CUDA',
      'C++',
      'Multi-GPU',
      'Parallel Computing',
      'CMake',
      'Python',
      'NVIDIA CUDA',
      'Traffic Simulation',
    ],
    links: {
      code: 'https://github.com/Heregaurav/lpsim',
      live: '#',
    },
    featured: true,
  },
];

const MAX_PEEK = 2;

const CARD_WIDTH = 'min(640px, 92vw)';
const CARD_HEIGHT = 'min(460px, 72vh)';

const cardFaceBase = {
  ...glassPanel,
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(0,212,255,0.28)',
  boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 45px rgba(0,212,255,0.14)',
  WebkitBackfaceVisibility: 'hidden',
  backfaceVisibility: 'hidden',
  overflow: 'hidden',
};

// Small hook so the stack can thin itself out and use gentler geometry on
// narrow screens without the layout ever jumping / overflowing.
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// Cards further back in the "notebook" — fanned out and tilted like pages
// sitting under the open cover, with a faint spine edge so it reads as
// pages rather than a flat drop-shadow stack. Clicking one brings it front.
function PeekCard({ project, depth, onSelect, isMobile }) {
  const Icon = project.icon;
  const hidden = depth > MAX_PEEK;

  // alternate the fan direction so pages splay left/right like an open book
  const dir = depth % 2 === 0 ? 1 : -1;
  const offsetY = (isMobile ? 10 : 16) * depth;
  const rotate = dir * (isMobile ? 1.6 : 2.2) * depth;
  const shiftX = dir * (isMobile ? 5 : 8) * depth;
  const scale = 1 - depth * (isMobile ? 0.03 : 0.04);

  return (
    <div
      data-reveal
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={hidden ? -1 : 0}
      onKeyDown={(e) => {
        if (!hidden && (e.key === 'Enter' || e.key === ' ')) onSelect(project);
      }}
      style={{
        ...glassPanel,
        position: 'absolute',
        left: '50%',
        top: offsetY,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        zIndex: 10 - depth,
        transformOrigin: 'bottom center',
        transform: `translateX(calc(-50% + ${shiftX}px)) rotate(${rotate}deg) scale(${scale})`,
        opacity: hidden ? 0 : Math.max(1 - depth * 0.18, 0.55),
        pointerEvents: hidden ? 'none' : 'auto',
        transition:
          'top .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1), opacity .4s ease, border-color .3s ease',
        padding: isMobile ? '22px 22px' : '36px 40px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: `1px solid ${COLORS.line}`,
      }}
      className="project-peek-card"
    >
      {/* faint "page edge" strip along the left, like leaves of a notebook */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '8%',
          bottom: '8%',
          width: 3,
          borderRadius: 2,
          background:
            'linear-gradient(to bottom, transparent, rgba(0,212,255,0.55), transparent)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div
          style={{
            width: isMobile ? 40 : 48,
            height: isMobile ? 40 : 48,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.18)',
            flexShrink: 0,
          }}
        >
          <Icon size={isMobile ? 18 : 22} color={COLORS.neonBlue} strokeWidth={1.6} />
        </div>
        <div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: '10.5px',
              letterSpacing: '1.5px',
              color: COLORS.textFaint,
              textTransform: 'uppercase',
              marginBottom: 5,
            }}
          >
            {project.tag}
          </div>
          <h3
            style={{
              fontFamily: FONT.display,
              fontSize: 'clamp(17px,4.2vw,22px)',
              fontWeight: 800,
              color: COLORS.textPrimary,
              margin: 0,
            }}
          >
            {project.title}
          </h3>
        </div>
      </div>
      <p
        style={{
          fontFamily: FONT.body,
          fontSize: '14px',
          lineHeight: 1.7,
          color: COLORS.textDim,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>
    </div>
  );
}

// The front-of-stack project — an actual 3D flip card, like the cover of
// the open notebook. Click the front face and it rotates around like a
// physical page to reveal the back, which holds the full write-up, stack,
// links, and an embedded live preview.
function ActiveFlipCard({ project, isMobile }) {
  const Icon = project.icon;
  const [flipped, setFlipped] = useState(false);
  const hasLive = Boolean(project.links.live) && project.links.live !== '#';
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewTimedOut, setPreviewTimedOut] = useState(false);
  // iframes are heavy and cramped on phones — skip the embed there and
  // just surface a clear CTA to open the live site instead.
  const showEmbeddedPreview = hasLive && !isMobile;

  useEffect(() => {
    if (!flipped) {
      setPreviewLoaded(false);
      setPreviewTimedOut(false);
      return undefined;
    }
    if (!showEmbeddedPreview) return undefined;
    // Some sites block being framed (X-Frame-Options / CSP) and never
    // signal failure — the iframe just stays blank. Rather than leave the
    // user staring at "LOADING PREVIEW…" forever, surface a fallback CTA
    // once it's taken too long, without ripping out the iframe itself.
    const t = setTimeout(() => setPreviewTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, [flipped, showEmbeddedPreview]);

  return (
    <div
      className="project-flip-outer"
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transform: 'translateX(-50%)',
        zIndex: 20,
      }}
    >
      <div className={`project-flip-inner${flipped ? ' is-flipped' : ''}`}>
        {/* FRONT FACE */}
        <div
          className="project-flip-face"
          onClick={() => setFlipped(true)}
          style={{
            ...cardFaceBase,
            padding: isMobile ? '24px 22px' : '38px 40px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 18, marginBottom: isMobile ? 16 : 22 }}>
            <div
              style={{
                width: isMobile ? 46 : 56,
                height: isMobile ? 46 : 56,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                boxShadow: '0 0 24px rgba(0,212,255,0.2)',
                flexShrink: 0,
              }}
            >
              <Icon size={isMobile ? 21 : 26} color={COLORS.neonBlue} strokeWidth={1.6} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: '11px',
                  letterSpacing: '2px',
                  color: COLORS.neonBlue,
                  opacity: 0.85,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                {project.tag}
              </div>
              <h3
                style={{
                  fontFamily: FONT.display,
                  fontSize: 'clamp(20px,5.5vw,28px)',
                  fontWeight: 800,
                  color: COLORS.textPrimary,
                  margin: 0,
                }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 'clamp(13px,3.4vw,15px)',
              lineHeight: 1.75,
              color: COLORS.textDim,
              margin: 0,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 5 : 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: isMobile ? '14px 0' : '20px 0' }}>
            {project.stack.slice(0, isMobile ? 4 : 6).map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: FONT.mono,
                  fontSize: '11.5px',
                  letterSpacing: '1px',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  border: `1px solid ${COLORS.line}`,
                  color: 'rgba(189,183,183,0.65)',
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: FONT.mono,
              fontSize: '12px',
              letterSpacing: '1.5px',
              color: COLORS.neonBlue,
            }}
          >
            <RotateCw size={14} /> TAP TO FLIP
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="project-flip-face project-flip-back"
          style={{ ...cardFaceBase, padding: isMobile ? '20px 18px' : '26px 30px' }}
        >
          <button
            type="button"
            className="project-flip-back-btn"
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(false);
              setPreviewLoaded(false);
            }}
          >
            <RotateCcw size={14} /> FLIP BACK
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: isMobile ? '2px 40px 12px 0' : '2px 46px 14px 0' }}>
            <div
              style={{
                width: isMobile ? 34 : 38,
                height: isMobile ? 34 : 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                flexShrink: 0,
              }}
            >
              <Icon size={isMobile ? 16 : 18} color={COLORS.neonBlue} strokeWidth={1.6} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  color: COLORS.textFaint,
                  textTransform: 'uppercase',
                }}
              >
                {project.tag}
              </div>
              <h4
                style={{
                  fontFamily: FONT.display,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 800,
                  color: COLORS.textPrimary,
                  margin: '3px 0 0',
                }}
              >
                {project.title}
              </h4>
            </div>
          </div>

          {showEmbeddedPreview ? (
            <div
              style={{
                position: 'relative',
                flexGrow: 1,
                borderRadius: 10,
                overflow: 'hidden',
                border: `1px solid ${COLORS.line}`,
                background: 'rgba(255,255,255,0.02)',
                minHeight: 0,
              }}
            >
              {!previewLoaded && !previewTimedOut && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT.mono,
                    fontSize: '11px',
                    letterSpacing: '1px',
                    color: COLORS.textFaint,
                  }}
                >
                  LOADING PREVIEW…
                </div>
              )}
              {!previewLoaded && previewTimedOut && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 14,
                    padding: '0 20px',
                    textAlign: 'center',
                    background: 'rgba(6,8,14,0.9)',
                    fontFamily: FONT.mono,
                    fontSize: '11px',
                    letterSpacing: '1px',
                    color: COLORS.textFaint,
                  }}
                >
                  <span>SITE DOESN'T ALLOW EMBEDDED PREVIEW</span>
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 999,
                      border: `1px solid ${COLORS.neonBlue}`,
                      color: COLORS.neonBlue,
                      textDecoration: 'none',
                      letterSpacing: '1.5px',
                    }}
                  >
                    <ExternalLink size={13} /> OPEN LIVE SITE
                  </a>
                </div>
              )}
              {flipped && (
                <iframe
                  src={project.links.live}
                  title={`${project.title} live preview`}
                  loading="lazy"
                  onLoad={() => {
                    setPreviewLoaded(true);
                    setPreviewTimedOut(false);
                  }}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    opacity: previewLoaded ? 1 : 0,
                    transition: 'opacity .4s ease',
                  }}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                flexGrow: 1,
                borderRadius: 10,
                border: `1px dashed ${COLORS.line}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                fontFamily: FONT.mono,
                fontSize: '12px',
                letterSpacing: '1px',
                color: COLORS.textFaint,
                textAlign: 'center',
                padding: '0 20px',
              }}
            >
              {hasLive ? (
                <>
                  <span>LIVE PREVIEW OPENS BEST FULL-SCREEN</span>
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 999,
                      border: `1px solid ${COLORS.neonBlue}`,
                      color: COLORS.neonBlue,
                      textDecoration: 'none',
                      letterSpacing: '1.5px',
                    }}
                  >
                    <ExternalLink size={13} /> OPEN LIVE SITE
                  </a>
                </>
              ) : (
                'LIVE PREVIEW NOT AVAILABLE YET'
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 18, marginTop: 14, flexShrink: 0 }}>
            {project.links.code && (
              <a
                href={project.links.code}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: FONT.mono,
                  fontSize: '11px',
                  letterSpacing: '1px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                }}
              >
                <Code2 size={14} /> CODE
              </a>
            )}
            {hasLive && !isMobile && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: FONT.mono,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  color: COLORS.neonBlue,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={13} /> OPEN LIVE SITE
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = PROJECTS.length;
  const isMobile = useIsMobile();

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <SectionWrapper
      id="projects"
      index="02"
      eyebrow="Selected Work"
      title="Things I've built"
      description="A mix of security engineering and interactive frontend — favoring projects with real technical depth. Browse with the arrows, flip the front card to preview it live."
    >
      <style>{`
        .project-peek-card:hover {
          border-color: rgba(0,212,255,0.4) !important;
        }

        .project-flip-outer {
          perspective: 1900px;
        }
        .project-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform .7s cubic-bezier(.22,1,.36,1);
        }
        .project-flip-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .project-flip-face {
          position: absolute;
          inset: 0;
        }
        .project-flip-back {
          transform: rotateY(180deg);
          cursor: default;
        }
        .project-flip-back-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 13px;
          border-radius: 999px;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.3);
          color: ${COLORS.neonBlue};
          font-family: ${FONT.mono};
          font-size: 10.5px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background .25s ease, border-color .25s ease, transform .25s ease;
          z-index: 5;
        }
        .project-flip-back-btn:hover {
          background: rgba(0,212,255,0.2);
          border-color: rgba(0,212,255,0.55);
          transform: scale(1.04);
        }
        .project-flip-back-btn:active {
          transform: scale(.94);
        }

        .project-nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(10,12,18,.75);
          border: 1px solid rgba(0,212,255,0.25);
          color: ${COLORS.neonBlue};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background .25s ease;
          flex-shrink: 0;
        }
        .project-nav-btn:hover {
          transform: scale(1.08);
          border-color: rgba(0,212,255,0.6);
          box-shadow: 0 0 24px rgba(0,212,255,0.25);
          background: rgba(0,212,255,0.1);
        }
        .project-nav-btn:active { transform: scale(.96); }

        .project-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          cursor: pointer;
          transition: background .3s ease, transform .3s ease;
        }
        .project-dot.is-active {
          background: ${COLORS.neonBlue};
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(0,212,255,0.6);
        }

        .project-stack-wrap {
          position: relative;
          width: min(640px, 92vw);
          max-width: 92vw;
          height: calc(min(460px, 72vh) + 60px);
          margin: 0 auto;
        }

        .project-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 28px;
        }

        @media (max-width: 768px) {
          .project-nav-btn {
            width: 40px;
            height: 40px;
          }
          .project-flip-back-btn {
            top: 12px;
            right: 12px;
          }
          .project-stack-wrap {
            height: calc(min(460px, 72vh) + 40px);
          }
          .project-controls {
            gap: 14px;
            margin-top: 20px;
          }
        }
      `}</style>

      <div
        className="project-wrapper"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '0 4px' : '0 12px',
        }}
      >
        <div className="project-stack-wrap">
          {PROJECTS.map((p, i) => {
            const depth = (i - activeIndex + total) % total;
            if (depth === 0) return null;
            return (
              <PeekCard
                key={p.title}
                project={p}
                depth={depth}
                onSelect={() => setActiveIndex(i)}
                isMobile={isMobile}
              />
            );
          })}
          <ActiveFlipCard key={PROJECTS[activeIndex].title} project={PROJECTS[activeIndex]} isMobile={isMobile} />
        </div>
      </div>

      <div className="project-controls">
        <button className="project-nav-btn" onClick={goPrev} aria-label="Previous project">
          <ChevronLeft size={20} />
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className={`project-dot${i === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
        <button className="project-nav-btn" onClick={goNext} aria-label="Next project">
          <ChevronRight size={20} />
        </button>
      </div>
    </SectionWrapper>
  );
}