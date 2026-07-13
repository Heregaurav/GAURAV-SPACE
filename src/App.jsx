import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';

import CustomCursor from './components/ui/CustomCursor';
import AudioManager from './components/ui/AudioManager';
import LandingUI from './components/ui/LandingUI';
import LaunchSequence from './components/ui/LaunchSequence';
import PlanetNav from './components/ui/PlanetNav';
import PlanetPanel from './components/ui/PlanetPanel';
import MissionControl from './components/ui/MissionControl';
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
      'SYSTEMS NOMINAL...',
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
  const [phase, setPhase] = useState('loading');
  const [activePlanet, setActivePlanet] = useState(null);
  const [warp, setWarp] = useState(false);
  const canvasRef = useRef();

  // Only the 'landing' phase scrolls (hero + About/Projects/.../Connect below it).
  // Every other phase is a full-screen, non-scrolling experience — so whenever we
  // leave or enter 'landing' we snap the window back to the top to avoid landing
  // mid-scroll inside a phase that isn't scrollable.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [phase]);

  const handleLaunch = () => {
    // remember user's scroll position so we can restore when they return
    prevScroll.current = window.scrollY || window.pageYOffset || 0;
    setPhase('launching');
  };

  const handleLaunchComplete = () => {
    setWarp(true);
    setTimeout(() => {
      setPhase('space');
      setWarp(false);
    }, 800);
  };

  const handleBackToLanding = () => {
    setWarp(true);
    setTimeout(() => {
      setPhase('landing');
      setActivePlanet(null);
      setWarp(false);
      // restore previous scroll position if available
      try { window.scrollTo({ top: prevScroll.current || 0, behavior: 'smooth' }); } catch (e) {}
    }, 600);
  };

  const handleRetreat = () => {
    setActivePlanet(null);
  };

  const handlePrevPlanet = () => {
    if (activePlanet === null) return;
    if (activePlanet === 0) {
      setActivePlanet(null);
      return;
    }
    setActivePlanet(activePlanet - 1);
  };

  const handleNextPlanet = () => {
    if (activePlanet === null) {
      setActivePlanet(0);
      return;
    }
    if (activePlanet < 4) {
      setActivePlanet(activePlanet + 1);
    }
  };

  const handleContact = () => {
    setPhase('contact');
  };

  const isScrollablePhase = phase === 'landing';
  const prevScroll = useRef(0);

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
              />
            )}
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

        {phase === 'launching' && (
          <LaunchSequence onComplete={handleLaunchComplete} />
        )}

        {phase === 'space' && (
          <>
            {/* HUD top bar */}
            {/* HUD top bar — redesigned as a lightweight cockpit HUD */}
            <div className="space-hud-topbar" style={{
              position: 'absolute',
              top: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              padding: '8px 18px',
              minWidth: '420px',
              background: 'linear-gradient(180deg, rgba(8,12,18,0.48), rgba(6,8,12,0.28))',
              border: '1px solid rgba(0,212,255,0.08)',
              borderRadius: '14px',
              backdropFilter: 'blur(8px) saturate(1.05)',
              boxShadow: '0 6px 30px rgba(0,0,0,0.45), 0 0 40px rgba(0,212,255,0.03) inset',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.85)',
              pointerEvents: 'auto',
            }}>
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
                <button onClick={handleBackToLanding} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                  transition: 'all 0.18s ease', fontFamily: 'var(--font-mono)'
                }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.45), 0 0 18px rgba(0,212,255,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                  <ArrowLeft size={14} />
                  RETURN TO BASE
                </button>

                <button style={{
                  padding: '8px 10px', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(180,79,255,0.04))', border: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer'
                }}>
                  <Power size={14} />
                </button>
              </div>
            </div>

            <PlanetNav
              activePlanet={activePlanet}
              onSelect={setActivePlanet}
              onPrev={handlePrevPlanet}
              onNext={handleNextPlanet}
              onRetreat={handleRetreat}
            />
            {activePlanet !== null && (
              <PlanetPanel
                planetIndex={activePlanet}
                onClose={() => setActivePlanet(null)}
              />
            )}
            {/* Contact button */}
            <button
              className="space-contact-button"
              onClick={handleContact}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                zIndex: 50,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '2px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Satellite size={14} /> MISSION CONTROL
            </button>
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