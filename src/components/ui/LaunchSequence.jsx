import { useEffect, useState } from 'react';

export default function LaunchSequence({ onComplete }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const showTimeout = window.setTimeout(() => setActive(true), 40);
    const completeTimeout = window.setTimeout(onComplete, 900);

    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  const color = active ? 'var(--neon-green)' : 'var(--neon-blue)';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        background: 'radial-gradient( rgba(0,0,20,0.88) 0%, rgba(0,0,0,0.98) 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 42%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          boxShadow: `0 0 60px ${color}55, inset 0 0 24px ${color}33`,
          display: 'grid',
          placeItems: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${color}ff 0%, ${color}22 34%, transparent 72%)`,
            boxShadow: `0 0 40px ${color}aa`,
            animation: active ? 'pulse-glow 1.4s ease-in-out infinite' : 'none',
          }}
        />
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
