import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Rocket, FileText, Radio, ChevronDown } from 'lucide-react';

const ROLES = [
  'Software Developer',
  'Cybersecurity Learner',
  'DevOps',
];

/* ─────────────────────────────────────────────
   TYPED TEXT COMPONENT
───────────────────────────────────────────── */
function TypedText({ texts }) {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const text = texts[current];
    let timeout;

    if (!isDeleting && displayed.length < text.length) {
      timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 70);
    } else if (!isDeleting && displayed.length === text.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), 35);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setCurrent((c) => (c + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, current, texts]);

  return (
    <span style={{ color: 'var(--neon-blue, #e6e6e6)', fontWeight: 400, textShadow: '0 0 8px rgba(0, 0, 0, 0.3)' }}>
      {displayed}
      <span className="typing-cursor" style={{
        marginLeft: '4px',
        paddingLeft: '2px',
        borderLeft: '2px solid var(--neon-blue, #cfcfcf)',
        animation: 'blink-cursor 0.75s infinite steps(2)',
      }} />
    </span>
  );
}

/* ─────────────────────────────────────────────
   DECORATIVE HEX GRID
───────────────────────────────────────────── */
function HexGrid() {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 25% 30%, rgba(0,212,255,0.04) 0%, transparent 60%),
        radial-gradient(circle at 80% 70%, rgba(180,79,255,0.04) 0%, transparent 60%)
      `,
      pointerEvents: 'none',
    }} />
  );
}

/* ─────────────────────────────────────────────
   MAIN UI LAYER
───────────────────────────────────────────── */
export default function LandingUI({ onLaunch, onResume, onContact }) {
  const containerRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const buttonsRef = useRef();
  const statsRef = useRef();
  const telemetryRef = useRef();
  const scrollCueRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline();

    const buttonElements = buttonsRef.current ? gsap.utils.toArray(buttonsRef.current.children) : [];
    const statElements = statsRef.current ? gsap.utils.toArray(statsRef.current.children) : [];

    tl.fromTo(titleRef.current,
      { opacity: 0, y: -30, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power4.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6'
    )
    .fromTo(buttonElements,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.1)' }, '-=0.3'
    )
    .fromTo(statElements,
      { opacity: 0, scale: 0.85, filter: 'blur(4px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' }, '-=0.4'
    )
    .fromTo(telemetryRef.current,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(scrollCueRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3'
    );

    // Gentle infinite bob on the scroll cue, started after the intro settles.
    const bob = gsap.to(scrollCueRef.current, {
      y: 8,
      duration: 1.1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.6,
    });

    return () => bob.kill();
  }, []);

  const stats = [

    { label: 'Tryhackme', value: 'Top5%' },
    { label: 'DSA', value: '800+' },
    { label: 'GPA', value: '8.5' },
  ];

  const handleScrollCue = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="landing-ui-container" style={{
      position: 'absolute', inset: 0,
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @media (max-width: 990px) {
          .system-status-panel { display: none !important; }
          .bottom-status-bar { font-size: 8px !important; width: 90% !important; text-align: center; }
          .landing-ui-container { align-items: flex-start !important; padding-top: 32px !important; }
          .landing-content-panel { margin-left: 16px !important; max-width: calc(100vw - 32px) !important; width: auto !important; }
          .landing-title-block { margin-top: 0 !important; }
          .landing-main-title, .landing-title-outline { text-align: left !important; margin-left: 0 !important; }
          .landing-subtitle { margin-bottom: 24px !important; }
          .landing-stat-wrap { gap: 10px !important; margin-bottom: 22px !important; }
          .landing-stat-card { min-width: 60px !important; padding: 10px 12px !important; }
          .landing-stat-value { font-size: 18px !important; }
          .landing-stat-label { font-size: 8px !important; letter-spacing: 0.8px !important; }
          .landing-buttons { gap: 12px !important; margin-top: 42px !important; margin-bottom: 90px !important; justify-content: center !important; }
          .landing-cta-button { padding: 12px 18px !important; font-size: 12px !important; max-width: 300px !important; }
        }
        @media (max-width: 640px) {
          .landing-content-panel { margin-left: 8px !important; max-width: calc(100vw - 16px) !important; width: auto !important; }
          .landing-cta-button { width: auto !important; min-width: 180px !important; max-width: 240px !important; }
          .landing-main-title { font-size: clamp(24px, 10vw, 34px) !important; }
          .landing-title-outline { font-size: clamp(28px, 10vw, 38px) !important; }
          .landing-stat-wrap { margin-bottom: 12px !important; justify-content: flex-start !important; gap: 5px !important; }
          .landing-stat-card { min-width: 48px !important; padding: 6px 8px !important; flex: 0 0 auto !important; }
          .landing-stat-value { font-size: 13px !important; }
          .landing-stat-label { font-size: 6px !important; }
          .landing-buttons {
            position: static !important;
            width: auto !important;
            max-width: 240px !important;
            margin-top: 12px !important;
            margin-bottom: 20px !important;
            gap: 8px !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            transform: none !important;
          }
          .landing-buttons > button { width: auto !important; }
          .secondary-action-row { display: none !important; }
          .landing-cta-button { padding: 7px 10px !important; font-size: 10px !important; border-radius: 10px !important; }
        }
      `}</style>

      <HexGrid />

      {/* Top-right status HUD */}


      {/* Left Interface Content Panel */}
      <div className="landing-content-panel" style={{
        marginLeft: 'clamp(24px, 7vw, 90px)',
        maxWidth: '100%',
        pointerEvents: 'all',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>

        {/* localized vignette behind the content to improve text readability without heavy boxes */}

        {/* Subtitle Mission Badge */}
      <div style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '14px',
          color: ' #ffffff',
          letterSpacing: '2px',
          marginTop:'10px',
          marginBottom: '35px',
          opacity: 0.85,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
         
           "Stay Hungry ,  Stay Foolish"
        <div
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "5px",
            fontSize: "11px",
            color: "rgba(238, 243, 245, 0.55)",
          }}
        >
          — STEVE JOBS
        </div>
      </div>
        {/* Cinematic Header Text Block */}
        <div ref={titleRef} className="landing-title-block" style={{ opacity: 0 }}>
          <h1 className="landing-main-title" style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(32px, 5.5vw, 40px)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-1.5px',
            marginBottom: '4px',
            color: '#ffffff',
            textShadow: '0 6px 22px rgba(0,0,0,0.55)',
            textAlign: 'left',
          }}>
            GAURAV KUMAR
          </h1>
          <h2 className="landing-title-outline" style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(30px, 5vw, 36px)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            WebkitTextStroke: '1.5px rgba(250, 250, 250, 0.8)',
            color: 'transparent',
            textShadow: '0 8px 30px rgba(0,0,0,0.55)',
            textAlign: 'left',
          }}>
            CHANDRAVANSHI
          </h2>
        </div>

        {/* Typed Dynamic Status String Indicator */}
        <div ref={subtitleRef} style={{
          fontSize: '15px',
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: '36px',
          opacity: 1,
        }}>
          <TypedText texts={ROLES} />
        </div>

        {/* Core Operational Statistics Matrix */}
        <div ref={statsRef} className="landing-stat-wrap" style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '44px',
          flexWrap: 'wrap',
        }}>
          {stats.map((s, i) => (
            <div key={i} className="landing-stat-card" style={{
              padding: '12px 14px',
              background: 'rgba(0,212,255,0.03)',
              border: '1px solid rgba(0,212,255,0.14)',
              borderRadius: '8px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
              flex: '1 1 72px',
              minWidth: '72px',
              opacity: 0,
              boxShadow: 'inset 0 0 10px rgba(0,212,255,0.01)'
            }}>
              <div className="landing-stat-value" style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: '20px',
                color: 'var(--neon-blue, #00d4ff)',
                fontWeight: 800,
                textShadow: '0 0 12px rgba(0,212,255,0.5)',
              }}>{s.value}</div>
              <div className="landing-stat-label" style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '9px',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '4px',
                textTransform: 'uppercase'
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Controls Matrix (LAUNCH moved to top-right to avoid overlap) */}
        <div ref={buttonsRef} className="landing-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            className="landing-cta-button"
            onClick={onLaunch}
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '13px',
              letterSpacing: '2px',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.22), rgba(180,79,255,0.18))',
              border: '1px solid rgba(0,212,255,0.4)',
              borderRadius: '14px',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0,
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 18px 40px rgba(0,0,0,0.28), 0 0 18px rgba(0,212,255,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 22px 48px rgba(0,0,0,0.3), 0 0 28px rgba(0,212,255,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.28), 0 0 18px rgba(0,212,255,0.1)';
            }}
          >
            <Rocket size={16} strokeWidth={2} /> BETA
          </button>

          <div className="secondary-action-row" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={onResume}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                letterSpacing: '2px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: 'rgba(255,255,255,0.78)',
                cursor: 'pointer',
                opacity: 0,
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1 1 160px',
                minWidth: '152px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.78)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <FileText size={13} strokeWidth={2} /> RESUME
            </button>
            <button
              onClick={onContact}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                letterSpacing: '2px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: 'rgba(255,255,255,0.78)',
                cursor: 'pointer',
                opacity: 0,
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1 1 140px',
                minWidth: '140px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(180,79,255,0.6)';
                e.currentTarget.style.color = 'var(--neon-purple, #b44fff)';
                e.currentTarget.style.background = 'rgba(180,79,255,0.08)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(180,79,255,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.78)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Radio size={13} strokeWidth={2} /> CONTACT
            </button>
          </div>
        </div>

        {/* Links */}
        <div style={{
          marginTop: '44px',
          display: 'flex',
          gap: '20px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.3)',
        }}>

        </div>
      </div>

      {/* Scroll cue — ties the hero to the sections now living below it */}
      <button
        ref={scrollCueRef}
        onClick={handleScrollCue}
        aria-label="Scroll to explore"
        style={{
          position: 'absolute',
          bottom: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          pointerEvents: 'all',
          opacity: 0,
          padding: '6px',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '9px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          SCROLL TO EXPLORE
        </span>
        <ChevronDown size={18} color="var(--neon-blue, #00d4ff)" strokeWidth={1.75} />
      </button>

      {/* Bottom Global Frame Status Ticker */}
      <div className="bottom-status-bar" style={{
        position: 'absolute',
        bottom: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '10px',
        letterSpacing: '3px',
        color: 'rgba(255,255,255,0.28)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        whiteSpace: 'nowrap'
      }}>
      </div>
    </div>
  );
}