import { useRef } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { COLORS, FONT, glassPanel } from './theme';
import TimelineScrollProgress, { TimelineScrollProgressStyles } from './TimelineScrollProgress';

const EXPERIENCE = [

  {
    period: '2025-2026',
    title: 'Technical Team member ',
    org: 'MLSA',
    description:
      'I was the part of MLSA cybersecurity Team ',
  },
  {
    period: '2025-2026',
    title: 'CO-LEAD',
    org: 'Dynamight: Dance Club IIIT Dharwad',
    description:
      'Lead the Team and won competitions ',
  },
];

// TODO: replace placeholder details with your actual education history
const EDUCATION = [
  {
    period: '2023 — 2027',
    title: 'B.Tech, Electronics and Communication',
    org: 'IIIT Dharwad',
    description:
      'Other than the Coursework  I learnt many other  independent projects spanning systems, full-stack development, alongside sustained competitive programming practice.',
  },
  {
    period: '2024 — Present',
    title: 'MINOR , Cybersecurity ',
    org: 'IIIT Dharwad',
    description:
      " Learnt cybersecurity SOC "
  },
  {
    period: '2022 — 2024',
    title: 'Class XI — XII, PCM',
    org: 'Your Senior Secondary School',
    description:
      'Higher secondary schooling with Physics, Chemistry, and Mathematics — the foundation for engineering entrance exams.',
  },
  {
    period: '2010 — 2022',
    title: 'Primary & Secondary Schooling',
    org: 'Your School Name',
    description:
      'Foundational schooling through Class X, building the base for later technical study.',
  },
];

function Timeline({ items, icon: Icon, dotClass, containerRef, itemRefs }) {
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <TimelineScrollProgress containerRef={containerRef} itemRefs={itemRefs} />

      {items.map((item, i) => (
        <div
          key={item.title}
          ref={itemRefs[i]}
          data-reveal
          className="exp-row"
          style={{ display: 'flex', gap: '22px', marginBottom: i === items.length - 1 ? 0 : '32px' }}
        >
          <div
            className={dotClass}
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: COLORS.bgPanel,
              border: `1px solid ${COLORS.line}`,
              zIndex: 1,
            }}
          >
            <Icon size={16} color={COLORS.neonBlue} strokeWidth={1.75} />
          </div>
          <div className="exp-panel" style={{ ...glassPanel, padding: '18px 22px', flexGrow: 1 }}>
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: COLORS.neonBlue,
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {item.period}
            </div>
            <h3
              style={{
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: '16px',
                color: COLORS.textPrimary,
                margin: '0 0 2px',
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                fontFamily: FONT.body,
                fontSize: '12.5px',
                color: COLORS.textFaint,
                marginBottom: '10px',
              }}
            >
              {item.org}
            </div>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: '13.5px',
                lineHeight: 1.7,
                color: COLORS.textDim,
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExperienceSection() {
  const eduContainerRef = useRef(null);
  const expContainerRef = useRef(null);
  // One ref per timeline row, created up front so the array identity is
  // stable across renders (avoids re-creating refs / re-running effects).
  const eduItemRefs = useRef(EDUCATION.map(() => ({ current: null }))).current;
  const expItemRefs = useRef(EXPERIENCE.map(() => ({ current: null }))).current;

  return (
    <SectionWrapper
      id="experience"
      index="06"
      eyebrow="Timeline"
      title="Education & Experience"
      description="A real chronological path — school, teams, and shipped work."
    >
      <TimelineScrollProgressStyles />
      <div
        className="exp-edu-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: '11px',
              letterSpacing: '2px',
              color: COLORS.textFaint,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Education
          </div>
          <Timeline
            items={EDUCATION}
            icon={GraduationCap}
            dotClass="edu-dot"
            containerRef={eduContainerRef}
            itemRefs={eduItemRefs}
          />
        </div>

        <div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: '11px',
              letterSpacing: '2px',
              color: COLORS.textFaint,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Experience
          </div>
          <Timeline
            items={EXPERIENCE}
            icon={Briefcase}
            dotClass="exp-dot"
            containerRef={expContainerRef}
            itemRefs={expItemRefs}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .exp-edu-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </SectionWrapper>
  );
}