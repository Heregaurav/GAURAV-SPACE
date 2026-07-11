import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Code2,
  ShieldCheck,
  ServerCog,
  Microchip,
  UsersRound,
} from 'lucide-react';

const NAV_ITEMS = [
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
    label: 'CLOUD.AWS',
    icon: ServerCog,
    color: '#ffffff',
  },
  {
    id: 3,
    label: 'ELEC.IOT',
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

export default function PlanetNav({ activePlanet, onSelect, onPrev, onNext, onRetreat }) {
  const containerRef = useRef();

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    );
  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '14px',
      width: 'min(960px, calc(100vw - 32px))',
    }}>
      <div style={{
             width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            padding: '16px',

            // Glass Background
            background: 'rgba(12, 18, 30, 0.35)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',

            // Border
            border: '1px solid rgba(255,255,255,0.08)',

            // Rounded Corners
            borderRadius: '24px',

            // Premium Depth
            boxShadow: `
              0 12px 40px rgba(0,0,0,0.28),
              inset 0 1px 0 rgba(255,255,255,0.05),
              0 0 30px rgba(0,212,255,0.08)
            `,

           overflow: 'hidden',
      }}>
        {NAV_ITEMS.map((item) => {
  const Icon = item.icon;

  return (
    <button
      key={item.id}
      onClick={() => onSelect(activePlanet === item.id ? null : item.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '12px 10px',
        borderRadius: '18px',
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
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: `${item.color}15`,
        }}
      >
        <Icon
          size={18}
          color={item.color}
          strokeWidth={2}
        />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}
      >
        {item.label}
      </span>
    </button>
  );
})}
 
   
      </div>

      <div style={{
        width: '100%',
        display: 'flex',
        gap: '10px',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        background: 'rgba(207, 207, 207, 0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
      }}>
        <button
          type="button"
          onClick={onPrev}
          style={{
            flex: 1,
            minWidth: '0',
            padding: '10px 14px',
            borderRadius: '14px',
            border: '1px solid rgba(148, 135, 135, 0.08)',
            background: 'rgba(153, 150, 150, 0.05)',
            color: 'rgba(255,255,255,0.85)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '1.5px',
          }}
        >
          ← PREVIOUS
        </button>

        <button
          type="button"
          onClick={onRetreat}
          style={{
            flex: 1,
            minWidth: '0',
            padding: '10px 14px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,212,255,0.08)',
            color: '#ebf7ff',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '1.5px',
          }}
        >
          HOME BASE
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{
            flex: 1,
            minWidth: '0',
            padding: '10px 14px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(180,79,255,0.08)',
            color: '#f8f2ff',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '1.5px',
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
