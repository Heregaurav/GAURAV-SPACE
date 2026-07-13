import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  Code2,
  ShieldCheck,
  ServerCog,
  Microchip,
  UsersRound,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 0,
    label: 'WEB.DEV',
    icon: Code2,
    color: '#ffffff',
  },
  {
    id: 1,
    label: 'CYBER.SEC',
    icon: ShieldCheck,
    color: '#ffffff',
  },
  {
    id: 2,
    label: 'DEVOPS',
    icon: ServerCog,
    color: '#ffffff',
  },
  {
    id: 3,
    label: 'ACADEMICS',
    icon: Microchip,
    color: '#ffffff',
  },
  {
    id: 4,
    label: 'LEADERSHIP',
    icon: UsersRound,
    color: '#ffffff',
  },
];

export default function PlanetNav({ activePlanet, onSelect, onPrev, onNext, onRetreat, compact = false }) {
  const containerRef = useRef();
  const [isCompact, setIsCompact] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  ));

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handleChange = (event) => setIsCompact(event.matches);

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const containerStyle = {
    position: compact ? 'fixed' : 'absolute',
    top: compact ? 'auto' : 'auto',
    bottom: compact ? '12px' : (isCompact ? '12px' : '24px'),
    left: compact ? '50%' : '50%',
    transform: compact ? 'translateX(-50%)' : 'translateX(-50%)',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: compact ? '10px' : (isCompact ? '10px' : '14px'),
    width: compact ? 'calc(100vw - 16px)' : (isCompact ? 'calc(100vw - 16px)' : 'min(960px, calc(100vw - 32px))'),
    maxWidth: compact ? '560px' : '960px',
  };

  const gridStyle = {
    width: '100%',
    display: compact ? 'flex' : 'grid',
    gridTemplateColumns: compact ? 'none' : (isCompact ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(120px, 1fr))'),
    gap: compact ? '8px' : (isCompact ? '8px' : '12px'),
    padding: compact ? '10px' : (isCompact ? '12px' : '16px'),
    background: 'rgba(12, 18, 30, 0.35)',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: compact ? '18px' : (isCompact ? '18px' : '24px'),
    boxShadow: `
      0 12px 40px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.05),
      0 0 30px rgba(0,212,255,0.08)
    `,
    overflow: compact ? 'auto hidden' : 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const controlRowStyle = {
    display: compact ? 'none' : 'flex',
    width: '100%',
    flexDirection: isCompact ? 'column' : 'row',
    gap: isCompact ? '8px' : '10px',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: isCompact ? '8px 10px' : '10px 14px',
    background: 'rgba(207, 207, 207, 0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: isCompact ? '16px' : '18px',
  };

  const controlButtonStyle = (background, borderColor, color) => ({
    flex: 1,
    minWidth: 0,
    padding: isCompact ? '9px 12px' : '10px 14px',
    borderRadius: isCompact ? '12px' : '14px',
    border: `1px solid ${borderColor}`,
    background,
    color,
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: isCompact ? '10px' : '11px',
    letterSpacing: '1.5px',
  });

  return (
    <div ref={containerRef} className="planet-nav-container" style={containerStyle}>
      <div className="planet-nav-grid" style={gridStyle}>
        {NAV_ITEMS.map((item) => {
  const Icon = item.icon;

  return (
    <button
      key={item.id}
      onClick={() => onSelect(activePlanet === item.id ? null : item.id)}
      style={{
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: compact ? 'flex-start' : 'center',
        gap: compact ? '8px' : '6px',
        padding: compact ? '10px 12px' : (isCompact ? '10px 8px' : '12px 10px'),
        borderRadius: compact ? '14px' : (isCompact ? '14px' : '18px'),
        minWidth: compact ? '92px' : 'auto',
        flex: compact ? '0 0 auto' : 'unset',
        border:
          activePlanet === item.id
            ? `1px solid ${item.color}`
            : '1px solid transparent',
        background:
          activePlanet === item.id
            ? `${item.color}18`
            : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        color:
          activePlanet === item.id
            ? item.color
            : 'rgba(255,255,255,0.75)',
      }}
      onMouseEnter={(e) => {
        if (activePlanet !== item.id) {
          e.currentTarget.style.background = `${item.color}12`;
          e.currentTarget.style.borderColor = `${item.color}33`;
        }
      }}
      onMouseLeave={(e) => {
        if (activePlanet !== item.id) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? 24 : (isCompact ? 30 : 34),
          height: compact ? 24 : (isCompact ? 30 : 34),
          borderRadius: '50%',
          background: `${item.color}15`,
        }}
      >
        <Icon
          size={compact ? 14 : (isCompact ? 16 : 18)}
          color={item.color}
          strokeWidth={2}
        />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: compact ? '8.5px' : (isCompact ? '9px' : '10px'),
          letterSpacing: compact ? '1px' : '1.4px',
          textTransform: 'uppercase',
          textAlign: compact ? 'left' : 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: compact ? 1 : 'unset',
          minWidth: 0,
        }}
      >
        {item.label}
      </span>
    </button>
  );
})}
 
   
      </div>

      <div className="planet-nav-controls" style={controlRowStyle}>
        <button
          type="button"
          onClick={onPrev}
          style={controlButtonStyle(
            'rgba(153, 150, 150, 0.05)',
            'rgba(148, 135, 135, 0.08)',
            'rgba(255,255,255,0.85)'
          )}
        >
          ← PREVIOUS
        </button>

        <button
          type="button"
          onClick={onRetreat}
          style={controlButtonStyle(
            'rgba(0,212,255,0.08)',
            'rgba(255,255,255,0.08)',
            '#ebf7ff'
          )}
        >
          HOME BASE
        </button>

        <button
          type="button"
          onClick={onNext}
          style={controlButtonStyle(
            'rgba(180,79,255,0.08)',
            'rgba(255,255,255,0.08)',
            '#f8f2ff'
          )}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
