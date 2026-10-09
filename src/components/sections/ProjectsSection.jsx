import { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Code2,
  ShieldCheck,
  Rocket,
  Boxes,
  Brain,
  Cpu,
  Play,
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
  icon: Brain,
  title: 'Curiosity',
  tag: 'Full-Stack · AI Learning Assistant',
  description:
    'An AI-powered study assistant that transforms topics, notes, and documents into personalized lessons, flashcards, quizzes, and learning paths.',
  stack: [
    'React',
    'TypeScript',
    'FastAPI',
    'MongoDB',
    'LangGraph',
    'Groq',
    'Google OAuth',
  ],
  links: {
    code: 'https://github.com/Heregaurav/curiosity',
    live: 'https://lacuriosity.vercel.app/',
  },
  featured: true,
 },
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
  icon: Play,
  title: 'Plavio',
  tag: 'Full-Stack · Video Streaming',
  description:
    'A YouTube-inspired video streaming platform built with the MERN stack,.',
  stack: [
    'React',
    'Node.js',
    'Express',
    'MongoDB',
    'Cloudinary',
    'JWT',
  ],
  links: {
    code: 'https://github.com/Heregaurav/Plavio',
    live: 'https://plavio.vercel.app/',
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

// Pure viewport units, no fixed px floor — the card can never be wider or
// taller than the screen itself.
const CARD_WIDTH = 'clamp(160px, 74vw, 620px)';
const CARD_HEIGHT = 'clamp(260px, 46vh, 460px)';

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

// Single resize listener (throttled with rAF) driving both breakpoints.
function useViewport() {
  const getBreakpoints = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return { isMobile: width <= 640, isCompact: width <= 380 };
  };

  const [breakpoints, setBreakpoints] = useState(getBreakpoints);

  useEffect(() => {
    let frame = null;
    const onResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setBreakpoints(getBreakpoints());
      });
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return breakpoints;
}

// True Cover Flow / VisionOS carousel math: cards sit at even angular
// steps around a large invisible cylinder, facing its center. Position
// comes from the cylinder itself — x = radius·sin(angle), z =
// radius·(cos(angle) − 1) — so x and z both grow with angle instead of
// being independently guessed numbers that happened to sit too close
// together. rotateY matches the angle so each card stays tangent to the
// cylinder and faces the viewer, the way album covers do in Cover Flow.
function getStackConfig(isMobile, isCompact) {
  if (isCompact) {
    return {
      maxPeek: 1,
      angleStep: 34,
      radius: 230,
      scale: [1, 0.86, 0.74],
      opacity: [1, 0.85, 0.6],
    };
  }
  if (isMobile) {
    return {
      maxPeek: 2,
      angleStep: 40,
      radius: 430,
      scale: [1, 0.87, 0.75],
      opacity: [1, 0.87, 0.62],
    };
  }
  return {
    maxPeek: 2,
    angleStep: 42,
    radius: 860,
    scale: [1, 0.88, 0.76],
    opacity: [1, 0.88, 0.65],
  };
}

/* ------------------------------------------------------------------ */
/*  Swipe-to-navigate — rebuilt without setPointerCapture and without  */
/*  a capture-phase click interceptor, since that combination is what  */
/*  fought the flip card's own click handling last time. Instead, a    */
/*  swipe just flips a shared ref; the tap-to-flip handler checks that */
/*  ref itself and ignores its own very next click if a swipe just     */
/*  happened. No event is ever blocked from reaching its real target,  */
/*  so ordinary taps/clicks anywhere (flip card, stack cards, nav      */
/*  buttons, links) behave exactly as before.                         */
/* ------------------------------------------------------------------ */
function useCarouselSwipe(onPrev, onNext, justSwipedRef) {
  const gestureRef = useRef({ pointerId: null, startX: 0, startY: 0 });

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    gestureRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const handlePointerUp = (e) => {
    const gesture = gestureRef.current;
    if (gesture.pointerId !== e.pointerId) return;

    const deltaX = e.clientX - gesture.startX;
    const deltaY = e.clientY - gesture.startY;
    const isSwipe = Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isSwipe) {
      justSwipedRef.current = true;
      (deltaX < 0 ? onNext : onPrev)();
    }

    gestureRef.current = { pointerId: null, startX: 0, startY: 0 };
  };

  const handlePointerCancel = (e) => {
    if (gestureRef.current.pointerId === e.pointerId) {
      gestureRef.current = { pointerId: null, startX: 0, startY: 0 };
    }
  };

  return { handlePointerDown, handlePointerUp, handlePointerCancel };
}

// Tap = flip to the back. Double-tap (a second tap landing within the
// window) = flip back to the front. If a swipe just happened (tracked
// via justSwipedRef, shared with useCarouselSwipe above), the very next
// tap is consumed silently instead of toggling the flip — this is what
// stops a swipe-ending release from also being read as a flip tap.
function useTapToFlip(justSwipedRef, delay = 350) {
  const [flipped, setFlipped] = useState(false);
  const lastTapRef = useRef(0);

  const onCardTap = (e) => {
    if (e.target.closest('a,button')) return;

    if (justSwipedRef.current) {
      justSwipedRef.current = false;
      return;
    }

    const now = Date.now();
    const isDoubleTap = now - lastTapRef.current < delay;
    lastTapRef.current = now;

    if (!flipped) {
      setFlipped(true);
    } else if (isDoubleTap) {
      setFlipped(false);
    }
  };

  return { flipped, onCardTap };
}

// A card sitting further around the invisible cylinder from the active
// one — genuinely displaced in both X and Z (not just rotated in place),
// so it reads as its own floating card rather than a rectangle stacked
// behind the front one. Clicking any visible card brings it to the
// front; since the element itself never unmounts, the transform/opacity
// changes animate smoothly around the whole cylinder rather than
// swapping instantly.
function StackCard({ project, depth, direction, config, onSelect, isCompact }) {
  const Icon = project.icon;
  const i = Math.min(depth, 2);
  const hidden = depth > config.maxPeek;

  const angleDeg = depth * config.angleStep;
  const angleRad = -(angleDeg * Math.PI) / 180;
  const tx = direction * config.radius * Math.sin(angleRad);
  const tz = config.radius * (Math.cos(angleRad) - 1);
  const rotateY = -direction * angleDeg;
  const scale = config.scale[i];
  const opacity = hidden ? 0 : config.opacity[i];
  const titleSize = i === 0 ? 'clamp(30px,6.4vw,50px)' : i === 1 ? 'clamp(22px,4.6vw,36px)' : 'clamp(17px,3.6vw,26px)';

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
        top: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        zIndex: 50 - i,
        transformStyle: 'preserve-3d',
        transform: `translateX(-50%) translate3d(${tx}px, 0px, ${tz}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        pointerEvents: hidden ? 'none' : 'auto',
        transition:
          'transform .65s cubic-bezier(.22,1,.36,1), opacity .5s ease, border-color .3s ease',
        padding: isCompact ? '16px 16px' : '30px 34px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: `1px solid ${COLORS.line}`,
      }}
      className="project-stack-card"
    >
      <div
        style={{
          width: isCompact ? 30 : 38,
          height: isCompact ? 30 : 38,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,212,255,0.06)',
          border: '1px solid rgba(0,212,255,0.18)',
          flexShrink: 0,
        }}
      >
        <Icon size={isCompact ? 14 : 18} color={COLORS.neonBlue} strokeWidth={1.6} />
      </div>

      <div style={{ flexGrow: 1 }} />

      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: '10px',
          letterSpacing: '1.5px',
          color: COLORS.textFaint,
          textTransform: 'uppercase',
          marginBottom: 6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {project.tag}
      </div>
      <h3
        style={{
          fontFamily: FONT.display,
          fontSize: titleSize,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 0.95,
          color: COLORS.textPrimary,
          margin: 0,
        }}
      >
        {project.title}
      </h3>
    </div>
  );
}

// The front-of-stack project — an actual 3D flip card, like the cover of
// the open notebook. A single tap flips it to the back; a second, quick
// tap flips it back to the front. The back holds the full write-up,
// stack, links, and an embedded live preview.
function ActiveFlipCard({ project, isMobile, isCompact, justSwipedRef }) {
  const Icon = project.icon;
  const { flipped, onCardTap } = useTapToFlip(justSwipedRef);
  const hasLive = Boolean(project.links.live) && project.links.live !== '#';
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewTimedOut, setPreviewTimedOut] = useState(false);
  const showEmbeddedPreview = hasLive;

  useEffect(() => {
    if (!flipped) {
      setPreviewLoaded(false);
      setPreviewTimedOut(false);
      return undefined;
    }
    if (!showEmbeddedPreview) return undefined;
    // Some sites block being framed (X-Frame-Options / CSP) and never
    // signal failure — the iframe just stays blank. Surface a fallback
    // CTA once it's taken too long, without ripping out the iframe.
    const t = setTimeout(() => setPreviewTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, [flipped, showEmbeddedPreview]);

  return (
    <div
      className="project-flip-outer"
      onClick={onCardTap}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transform: 'translateX(-50%) translateZ(0)',
        zIndex: 100,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`project-flip-inner${flipped ? ' is-flipped' : ''}`}>
        {/* FRONT FACE */}
        <div
          className="project-flip-face"
          style={{
            ...cardFaceBase,
            padding: isCompact ? '14px 12px' : isMobile ? '18px 16px' : '38px 40px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 10 : isMobile ? 12 : 14, marginBottom: isCompact ? 10 : isMobile ? 12 : 16 }}>
            <div
              style={{
                width: isCompact ? 32 : isMobile ? 38 : 44,
                height: isCompact ? 32 : isMobile ? 38 : 44,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                boxShadow: '0 0 24px rgba(0,212,255,0.2)',
                flexShrink: 0,
              }}
            >
              <Icon size={isCompact ? 15 : isMobile ? 17 : 20} color={COLORS.neonBlue} strokeWidth={1.6} />
            </div>
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: '11px',
                letterSpacing: '2px',
                color: COLORS.neonBlue,
                opacity: 0.85,
                textTransform: 'uppercase',
              }}
            >
              {project.tag}
            </div>
          </div>

          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 'clamp(12px,3.1vw,15px)',
              lineHeight: 1.7,
              color: COLORS.textDim,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: isCompact ? 2 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </p>

          <div style={{ flexGrow: 1 }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: isCompact ? 8 : 12 }}>
            {project.stack.slice(0, isCompact ? 3 : isMobile ? 4 : 6).map((s) => (
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

          <h3
            style={{
              fontFamily: FONT.display,
              fontSize: 'clamp(28px,6.8vw,58px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              color: COLORS.textPrimary,
              margin: '0 0 14px',
            }}
          >
            {project.title}
          </h3>

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
          style={{ ...cardFaceBase, padding: isCompact ? '10px 10px' : isMobile ? '14px 14px' : '26px 30px' }}
        >
          <div
            className="project-flip-back-hint"
            onClick={(e) => e.stopPropagation()}
          >
            <RotateCcw size={13} /> DOUBLE-TAP 
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: isCompact ? '0 0 8px' : isMobile ? '0 0 10px' : '2px 0 14px' }}>
            <div
              style={{
                width: isCompact ? 30 : isMobile ? 34 : 38,
                height: isCompact ? 30 : isMobile ? 34 : 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                flexShrink: 0,
              }}
            >
              <Icon size={isCompact ? 14 : isMobile ? 16 : 18} color={COLORS.neonBlue} strokeWidth={1.6} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h4
                style={{
                  fontFamily: FONT.display,
                  fontSize: isCompact ? '13px' : isMobile ? '15px' : '18px',
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
                minHeight: isCompact ? 100 : isMobile ? 130 : 0,
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
                    textAlign: 'center',
                    padding: '0 12px',
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
                    <ExternalLink size={13} /> LIVE SITE
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
                    pointerEvents: 'none',
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
              LIVE PREVIEW NOT AVAILABLE YET
            </div>
          )}

          <div style={{ display: 'flex', gap: 18, marginTop: isCompact ? 8 : 12, flexShrink: 0 }}>
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
            {hasLive && (
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
                <ExternalLink size={13} />  LIVE SITE
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
  const { isMobile, isCompact } = useViewport();
  const stackConfig = getStackConfig(isMobile, isCompact);
  const justSwipedRef = useRef(false);

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);
  const swipeHandlers = useCarouselSwipe(goPrev, goNext, justSwipedRef);

  return (
    <SectionWrapper
      id="projects"
      index="02"
      eyebrow="Selected Work"
      title="Things I've built"
      description="A mix of security engineering and interactive frontend — favoring projects with real technical depth. Swipe or use the arrows to browse, tap the front card to preview it live, double-tap to flip back."
    >
      <style>{`
        .project-stack-card:hover {
          border-color: rgba(0,212,255,0.45) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(0,212,255,0.12);
        }

        .project-flip-outer {
          perspective: 1900px;
          cursor: pointer;
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
        }
        .project-flip-back-hint {
          position: absolute;
          top: 12px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.22);
          color: ${COLORS.neonBlue};
          font-family: ${FONT.mono};
          font-size: 9.5px;
          letter-spacing: 0.8px;
          padding: clamp(4px,1vw,6px) clamp(8px,2vw,11px);
          white-space: nowrap;
          pointer-events: none;
          z-index: 5;
          opacity: 0.85;
        }

        .project-nav-btn {
          width:clamp(36px,7vw,48px);
          height:clamp(36px,7vw,48px);
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
          width: min(${CARD_WIDTH}, calc(100vw - 12px));
          height: min(calc(${CARD_HEIGHT} + clamp(20px,4vw,48px)), calc(100vh - 220px));
          margin: 0 auto;
          perspective: 1800px;
          transform-style: preserve-3d;
          max-width: 100%;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }

        .project-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap:clamp(10px,3vw,18px);
          margin-top:clamp(16px,4vw,28px);
        }

        @media (max-width: 768px) {

          .project-flip-back-hint {
            top: 10px;
            right: 10px;
            font-size: 8.5px;
            padding: 5px 9px;
          }
          .project-stack-wrap {
            width: min(${CARD_WIDTH}, calc(100vw - 10px));
            height: min(calc(${CARD_HEIGHT} + 28px), calc(100vh - 205px));
          }
          .project-controls {
            gap: 14px;
            margin-top: 20px;
          }
        }

        @media (max-width: 380px) {

          .project-stack-wrap {
            width: min(90vw, ${CARD_WIDTH});
            height: min(calc(${CARD_HEIGHT} + 20px), calc(100vh - 180px));
          }
          .project-controls {
            gap: 10px;
            margin-top: 16px;
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
          padding: isCompact ? '0 10px' : isMobile ? '0 8px' : '0 12px',
          // Peek cards intentionally extend past the wrap's own bounds —
          // clip that horizontally so it can't push the whole page into
          // a horizontal scrollbar on narrow screens. Vertical overflow
          // (shadows/glow) is left alone.
          overflowX: 'hidden',
          overflowY: 'visible',
        }}
      >
        <div
          className="project-stack-wrap"
          onPointerDown={swipeHandlers.handlePointerDown}
          onPointerUp={swipeHandlers.handlePointerUp}
          onPointerCancel={swipeHandlers.handlePointerCancel}
        >
          {PROJECTS.map((p, i) => {
            // Shortest signed distance around the circular deck: negative
            // = sits behind to the left (previous), positive = behind to
            // the right (next). Symmetric, so the stack fans out on both
            // sides of the active card instead of only forward.
            let diff = (i - activeIndex + total) % total;
            if (diff > total / 2) diff -= total;
            if (diff === 0) return null;
            const depth = Math.abs(diff);
            const direction = -Math.sign(diff);
            return (
              <StackCard
                key={p.title}
                project={p}
                depth={depth}
                direction={direction}
                config={stackConfig}
                onSelect={() => setActiveIndex(i)}
                isCompact={isCompact}
              />
            );
          })}
          <ActiveFlipCard
            key={PROJECTS[activeIndex].title}
            project={PROJECTS[activeIndex]}
            isMobile={isMobile}
            isCompact={isCompact}
            justSwipedRef={justSwipedRef}
          />
        </div>
      </div>

      <div className="project-controls">
        <button className="project-nav-btn" onClick={goPrev} aria-label="Previous project">
          <ChevronLeft size={isCompact ? 16 : 20} />
        </button>
        <div style={{ display: 'flex', gap: isCompact ? 7 : 10 }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className={`project-dot${i === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
        <button className="project-nav-btn" onClick={goNext} aria-label="Next project">
          <ChevronRight size={isCompact ? 16 : 20} />
        </button>
      </div>
    </SectionWrapper>
  );
}