import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';

import CustomCursor from './components/ui/CustomCursor';
import AudioManager from './components/ui/AudioManager';
import LandingUI from './components/ui/LandingUI';
import LaunchSequence from './components/ui/LaunchSequence';
import PlanetNav from './components/ui/PlanetNav';
import PlanetPanel from './components/ui/PlanetPanel';

import LandingScene from './scenes/LandingScene';
import PlanetScene from './scenes/PlanetScene';
import ScrollSections from './components/sections/ScrollSections';
import { Power, ArrowLeft, Satellite, Clock } from 'lucide-react';

// Warp transition overlay
function WarpOverlay({ active }) {
  if (!active) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #ffffff 0%, #00d4ff 20%, #b44fff 50%, transparent 70%)',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.3s',
      zIndex: 100,
      pointerEvents: 'none',
      animation: 'warp-flash 0.8s ease-out forwards',
    }}>
      <style>{`
        @keyframes warp-flash {
          0% { opacity: 0; transform: scaleX(1); }
          30% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(8); }
        }
      `}</style>
    </div>
  );
}

// Loading screen
function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('BOOTING SYSTEMS...');

  useEffect(() => {
    const messages = [
      'INITIALIZING ENGINE...',
      'LOADING STAR CHARTS...',
      'CALIBRATING THRUSTERS...',
      'READY FOR LAUNCH',
    ];
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(onDone, 400);
      }
      setProgress(Math.min(p, 100));
      setStatus(messages[Math.min(Math.floor(p / 20), 4)]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#020408',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 200,
    }}>
      {/* Animated rings */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          width: `${i * 120}px`, height: `${i * 120}px`,
          border: '1px solid rgba(0, 213, 255, 0.1)',
          borderRadius: '50%',
          animation: `rotate-slow ${4 + i * 2}s linear infinite`,
        }} />
      ))}

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(24px, 4vw, 40px)',
        letterSpacing: '8px',
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #476268, #ffffff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>

        GAURAV.SPACE
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '4px',
        color: 'rgba(153, 183, 189, 0.5)',
        marginBottom: '48px',
      }}>
        GET TO KNOW MORE ABOUT ME 
      </div>

      {/* Progress bar */}
      <div style={{
        width: '280px',
        height: '2px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '1px',
        marginBottom: '16px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #3b585e, #ffffff)',
          transition: 'width 0.2s ease',
          boxShadow: '0 0 10px #00d4ff',
        }} />
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '3px',
        color: 'rgba(255, 255, 255, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        width: '280px',
      }}>
        <span>{status}</span>
        <span>{Math.floor(progress)}%</span>
      </div>
    </div>
  );
}

// PHASES: loading → landing → launching → space → contact
export default function App() {
  const STORAGE_KEY = 'gaurav-space-app-state';
  const initialState = (() => {
    if (typeof window === 'undefined') {
      return { phase: 'loading', activePlanet: null, scrollY: 0 };
    }

    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { phase: 'loading', activePlanet: null, scrollY: 0 };
      }

      const parsed = JSON.parse(raw);
      return {
        phase: parsed.phase || 'loading',
        activePlanet: Number.isInteger(parsed.activePlanet) ? parsed.activePlanet : null,
        scrollY: Number(parsed.scrollY) || 0,
      };
    } catch (e) {
      return { phase: 'loading', activePlanet: null, scrollY: 0 };
    }
  })();

  const [phase, setPhase] = useState(initialState.phase);
  const [activePlanet, setActivePlanet] = useState(initialState.activePlanet);
  const [warp, setWarp] = useState(false);
  const [spaceReady, setSpaceReady] = useState(false);
  const canvasRef = useRef();
  const prevScroll = useRef(0);
  const initialScrollY = useRef(initialState.scrollY);
  const hasRestoredScroll = useRef(false);

  const persistAppState = (nextPhase = phase, nextActivePlanet = activePlanet) => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        phase: nextPhase,
        activePlanet: nextActivePlanet,
        scrollY: window.scrollY || 0,
      }));
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (hasRestoredScroll.current) return;

    hasRestoredScroll.current = true;
    const targetScroll = initialScrollY.current || 0;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetScroll, behavior: 'auto' });
    });
  }, [phase]);

  useEffect(() => {
    persistAppState();
  }, [phase, activePlanet]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const persistOnExit = () => persistAppState();

    window.addEventListener('beforeunload', persistOnExit);
    window.addEventListener('pagehide', persistOnExit);

    return () => {
      window.removeEventListener('beforeunload', persistOnExit);
      window.removeEventListener('pagehide', persistOnExit);
    };
  }, [phase, activePlanet]);

  const handleLaunch = () => {
    // remember user's scroll position so we can restore when they return
    prevScroll.current = window.scrollY || window.pageYOffset || 0;
    setSpaceReady(false);
    persistAppState('launching', activePlanet);
    setPhase('launching');
  };

  const handleLaunchComplete = () => {
    setWarp(true);
    setTimeout(() => {
      persistAppState('space', activePlanet);
      setPhase('space');
      setWarp(false);
    }, 800);
  };

  const handleBackToLanding = () => {
    setWarp(true);
    setTimeout(() => {
      persistAppState('landing', null);
      setPhase('landing');
      setActivePlanet(null);
      setWarp(false);
      // restore previous scroll position if available
      try { window.scrollTo({ top: prevScroll.current || 0, behavior: 'smooth' }); } catch (e) {}
    }, 600);
  };

  const handleRetreat = () => {
    persistAppState(phase, null);
    setActivePlanet(null);
  };

  const handlePrevPlanet = () => {
    if (activePlanet === null) return;
    if (activePlanet === 0) {
      persistAppState(phase, null);
      setActivePlanet(null);
      return;
    }
    persistAppState(phase, activePlanet - 1);
    setActivePlanet(activePlanet - 1);
  };

  const handleNextPlanet = () => {
    if (activePlanet === null) {
      persistAppState(phase, 0);
      setActivePlanet(0);
      return;
    }
    if (activePlanet < 4) {
      persistAppState(phase, activePlanet + 1);
      setActivePlanet(activePlanet + 1);
    }
  };

  const handleContact = () => {
    persistAppState('contact', activePlanet);
    setPhase('contact');
  };

  const isScrollablePhase = phase === 'landing';
  const [isCompactHud, setIsCompactHud] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth <= 840 : false
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 840px)');
    const handleChange = (event) => setIsCompactHud(event.matches);

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const spaceHudStyle = {
    position: 'absolute',
    top: isCompactHud ? '12px' : '18px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    flexWrap: isCompactHud ? 'wrap' : 'nowrap',
    justifyContent: 'center',
    gap: isCompactHud ? '8px' : '18px',
    padding: isCompactHud ? '8px 12px' : '8px 18px',
    width: isCompactHud ? 'min(100%, calc(100vw - 16px))' : 'auto',
    minWidth: isCompactHud ? '0' : '420px',
    background: 'linear-gradient(180deg, rgba(8,12,18,0.48), rgba(6,8,12,0.28))',
    border: '1px solid rgba(0,212,255,0.08)',
    borderRadius: '14px',
    backdropFilter: 'blur(8px) saturate(1.05)',
    boxShadow: '0 6px 30px rgba(0,0,0,0.45), 0 0 40px rgba(0,212,255,0.03) inset',
    fontFamily: 'var(--font-mono)',
    fontSize: isCompactHud ? '11px' : '12px',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.85)',
    pointerEvents: 'auto',
  };

  const returnButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: isCompactHud ? '7px 10px' : '8px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    color: 'rgba(255,255,255,0.9)',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    fontFamily: 'var(--font-mono)',
    fontSize: isCompactHud ? '10px' : 'inherit',
  };

  const powerButtonStyle = {
    padding: isCompactHud ? '7px 9px' : '8px 10px',
    borderRadius: '10px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(180,79,255,0.04))',
    border: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer',
  };

  const contactButtonStyle = {
    position: isCompactHud ? 'fixed' : 'absolute',
    top: isCompactHud ? '12px' : '18px',
    right: isCompactHud ? '12px' : '18px',
    zIndex: 50,
    fontFamily: 'var(--font-mono)',
    fontSize: isCompactHud ? '10px' : '11px',
    letterSpacing: '2px',
    padding: isCompactHud ? '8px 10px' : '10px 14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.9)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    maxWidth: isCompactHud ? 'calc(100vw - 24px)' : 'none',
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <CustomCursor />
      <AudioManager phase={phase} />

      {/*
        HERO LAYER — rendered as a normal full-height section so the page can
        scroll naturally like a regular webpage while keeping the 3D scene and
        landing UI attached to the hero area.
      */}
      <div style={{ position: 'relative', zIndex: 0 }}>
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* 3D Canvas */}
        {phase !== 'loading' && phase !== 'contact' && (
          <Canvas
            ref={canvasRef}
            onPointerMissed={() => setActivePlanet(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
            }}

            camera={{
              position: [0, 0, 10],
              fov: 75,
              near: 0.1,
              far: 2000
            }}

            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance'
            }}

            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              {phase === 'landing' && (
                <LandingScene onLaunch={handleLaunch} />
              )}
              {phase === 'launching' && (
                <LandingScene launching onLaunch={handleLaunch} />
              )}
              {phase === 'space' && (
                <PlanetScene
                  activePlanet={activePlanet}
                  onSelectPlanet={setActivePlanet}
                  onZoomOut={() => {
                    setActivePlanet(null);
                  }}
                  onReady={() => setSpaceReady(true)}
                />
              )}
            </Suspense>
          </Canvas>
        )}

        {/* Background for non-3D phases */}
        {(phase === 'contact') && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 30%, #0a0a2a 0%, #020408 60%)',
          }}>
            {/* Static star bg */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `
                radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.6) 0%, transparent 0%),
                radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.4) 0%, transparent 0%),
                radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.5) 0%, transparent 0%),
                radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.3) 0%, transparent 0%),
                radial-gradient(1px 1px at 50% 90%, rgba(255,255,255,0.5) 0%, transparent 0%)
              `,
              backgroundSize: '200px 200px',
            }} />
          </div>
        )}

        {/* UI Layers */}
        {phase === 'loading' && (
          <LoadingScreen onDone={() => setPhase('landing')} />
        )}

        {phase === 'landing' && (
          <LandingUI
            onLaunch={handleLaunch}
            onResume={() => window.open('#', '_blank')}
            onContact={handleContact}
          />
        )}

        {(phase === 'launching' || (phase === 'space' && !spaceReady)) && (
          <LaunchSequence
            onComplete={phase === 'launching' ? handleLaunchComplete : undefined}
            title={phase === 'launching' ? 'GAURAV UNIVERSE LAUNCH' : 'GAURAV UNIVERSE LOADING'}
            subtitle={phase === 'launching' ? 'Igniting engines and aligning trajectory...' : 'Loading GLB assets and stabilizing the scene...'}
            accent={phase === 'launching' ? 'var(--neon-blue)' : 'var(--neon-green)'}
            autoComplete={phase === 'launching'}
          />
        )}

        {phase === 'space' && (
          <>
            {/* HUD top bar */}
            {/* HUD top bar — redesigned as a lightweight cockpit HUD */}
            <div className="space-hud-topbar" style={spaceHudStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'lime', fontSize: '10px' }}>●</span>
                <span style={{ fontWeight: 700, color: 'rgba(0,212,255,0.95)' }}>LIVE</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.95 }}>
                <Satellite size={14} />
                <div style={{ fontWeight: 600 }}>GAURAV'S UNIVERSE</div>
              </div>

              <div style={{ marginLeft: '8px', marginRight: '8px', color: 'rgba(255,255,255,0.12)' }}>|</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                <Clock size={14} />
                <div>{new Date().toLocaleTimeString()}</div>
              </div>

              <div style={{ flex: 1 }} />

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={handleBackToLanding} style={returnButtonStyle} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.45), 0 0 18px rgba(0,212,255,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                  <ArrowLeft size={14} />
                  RETURN TO BASE
                </button>


              </div>
            </div>

            <PlanetNav
              activePlanet={activePlanet}
              onSelect={setActivePlanet}
              onPrev={handlePrevPlanet}
              onNext={handleNextPlanet}
              onRetreat={handleRetreat}
              compact={isCompactHud}
            />
            {activePlanet !== null && (
              <PlanetPanel
                planetIndex={activePlanet}
                onClose={() => setActivePlanet(null)}
              />
            )}
          </>
        )}
      </div>
    </div>

      {/*
        SCROLL LAYER — only exists during 'landing'. The hero section above
        occupies the first viewport, and the content below scrolls up naturally.
      */}
      {isScrollablePhase && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ScrollSections />
        </div>
      )}

      {/* Warp flash */}
      <WarpOverlay active={warp} />
    </div>
  );
}