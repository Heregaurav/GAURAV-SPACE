import { useEffect, useState } from 'react';

export default function LaunchSequence({
  onComplete,
  title = "Welcome to my  Space",
  subtitle = 'Connecting to the Cosmos....',
  accent = '#D4AF37',
  autoComplete = true,
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const showTimeout = window.setTimeout(() => setActive(true), 40);
    const completeTimeout = autoComplete && onComplete ? window.setTimeout(onComplete, 900) : null;

    return () => {
      window.clearTimeout(showTimeout);
      if (completeTimeout) window.clearTimeout(completeTimeout);
    };
  }, [autoComplete, onComplete]);

  const color = active ? accent : 'var(--neon-blue)';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.08) 0%, rgba(0, 0, 0, 0.92) 55%, rgba(0, 0, 0, 0.98) 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 48%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
            width: '520px',
            height: '520px',

            borderRadius: '50%',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',

            padding: '32px',

            background: 'rgba(255, 255, 255, 0.02)',   // much more transparent
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',

            border: `1px solid ${color}40`,
            boxShadow: `
                0 0 80px ${color}20,
                inset 0 0 40px ${color}10
            `,
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(18px, 4vw, 30px)',
          letterSpacing: '5px',
          color: 'rgba(255,255,255,0.95)',
          textAlign: 'center',
        }}>
          {title}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.58)',
             marginTop: '10px',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          {subtitle}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '999px',
            border: `1px solid ${color}33`,
               marginTop: '20px',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 14px ${color}` }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.75)' }}>
            {active ? 'LOADING ASSETS' : 'INITIALIZING'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.88; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
