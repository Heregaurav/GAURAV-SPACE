import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const PLANET_DATA = {
  webdev: {
    title: 'WEB DEVELOPMENT',
    subtitle: 'Full Stack Development',
    color: '#adf1ff',
    icon: '⚡',
    description:
      'Building modern full-stack web applications with scalable backend architectures, real-time communication, and cloud deployment.',
    skills: [
      'React.js / Next.js',
      'Node.js / Express.js',
      'MongoDB',
      'PostgreSQL',
      'WebSockets',
    ],
    projects: [
      {
        name: 'Inkwell',
        desc: 'AI-powered platform for readers and writers',
        tech: ['React', 'Node.js', 'MongoDB'],
        link: 'https://myinkwell.vercel.app/',
      },
      {
        name: 'Anonymous chat',
        desc: 'Chat anonymously using WebSockets',
        tech: ['Socket.IO', 'Express', 'React'],
        link: 'https://void25.vercel.app/',
      },
      {
        name: 'Tracely AI',
        desc: 'Showed the vulnerabilites  effectively ',
        tech: ['React', 'Node.js', 'ML'],
        link: 'https://tracely-ai.vercel.app/',
      },
    ],
  },

  cybersec: {
    title: 'CYBERSECURITY',
    subtitle: 'Security & Threat Detection',
    color: '#e4e4e4',
    icon: '🛡️',
    description:
      'Exploring offensive and defensive security through web security, network analysis, behavioral analytics, and AI-driven threat detection.',
    skills: [
      'Burp Suite',
      'Wireshark',
      'Nmap',
      'Metasploit',
      'Splunk',
      'OSINT',
      'Web Hacking',
    ],
    projects: [
      {
        name: 'Tracely AI',
        desc: 'UEBA-based insider threat detection',
        tech: ['Python', 'Isolation Forest', 'React'],
        link: 'https://tracely-ai.vercel.app/',
      },
      {
        name: 'Guardian AI',
        desc: 'AI-powered harmful content detection',
        tech: ['RoBERTa', 'Python', 'NLP'],
        link: 'https://github.com/Heregaurav/Guardian-AI',
      },
      {
        name: 'TryHackMe',
        desc: 'Top 5% global ranking',
        tech: ['Web Security', 'Networking'],
      },
    ],
  },

  cloud: {
    title: 'DEVOPS',
    subtitle: 'Infrastructure & Deployment',
    color: '#f8f8f8',
    icon: '☁️',
    description:
      'Deploying scalable applications using containers, Kubernetes, AWS, and modern DevOps practices.',
    skills: [
      'AWS',
      'Docker',
      'Kubernetes',
      'GitHub Actions',
      'Prometheus',
      'Grafana',
    ],
    projects: [
      {
        name: 'Inkwell Deployment',
        desc: 'Cloud-native deployment on AWS',
        tech: ['AWS', 'Docker', 'Kubernetes'],
        link: 'https://myinkwell.vercel.app/',
      },
      {
        name: 'Video streaming Platform',
        desc: 'Dockerized full-stack applications',
        tech: ['Docker', 'Node.js'],
        link: 'https://vidtube1.vercel.app/',
      },
    ],
  },

  academics: {
    title: 'ACADEMICS',
    subtitle: 'ECE + Cybersecurity',
    color: '#dadada',
    icon: '🎓',
    description:
      'Electronics & Communication Engineering undergraduate with a Minor in Cybersecurity, combining software engineering with secure system design.',
    skills: [
      'C++',
      'Python',
      'TypeScript',
      'Go',
      'Bash',
      'PowerShell',
    ],
    projects: [
      {
        name: 'B.Tech in ECE',
        desc: 'Indian Institute of Information Technology Dharwad',
        tech: ['Electronics', 'Programming'],
      
      },
      {
        name: 'Minor in Cybersecurity',
        desc: 'Focused on secure systems and networking',
        tech: ['Cybersecurity', 'Networking'],

      },
    ],
  },

  leadership: {
    title: 'LEADERSHIP',
    subtitle: 'Leadership & Extracurriculars',
    color: '#ffffff',
    icon: '🌟',
    description:
      'Leading student communities, organizing technical events, and contributing to campus activities alongside competitive sports.',
    skills: [
      'Team Leadership',
      'Event Management',
      'Technical Workshops',
      'Communication',
      'Collaboration',
    ],
    projects: [
      {
        name: 'Dance Club Lead',
        desc: 'Led the team to multiple competition wins and organized college fest events.',
        tech: ['Leadership', 'Events'],
        
      },
      {
        name: 'MLSA Technical Team',
        desc: 'Conducted workshops on web, cloud, and cybersecurity.',
        tech: ['Workshops', 'Cloud', 'Security'],
        
      },
      {
        name: 'College Volleyball Team',
        desc: 'INTER-IIIT team member and junior state-level player.',
        tech: ['Teamwork', 'Sports'],
        
      },
    ],
  },
};
function SkillBar({ name, level, color, delay }) {
  const barRef = useRef();

  useEffect(() => {
    gsap.fromTo(barRef.current,
      { width: '0%' },
      { width: `${level}%`, duration: 1.2, delay, ease: 'power3.out' }
    );
  }, [level, delay]);

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>
          {name}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color, letterSpacing: '1px' }}>
          {level}%
        </span>
      </div>
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div ref={barRef} style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${color}`,
          width: '0%',
        }} />
      </div>
    </div>
  );
}

export default function PlanetPanel({ planetIndex, onClose }) {
  const panelRef = useRef();
  const [isCompact, setIsCompact] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth <= 720 : false
  ));
  const types = ['webdev', 'cybersec', 'cloud', 'academics', 'leadership'];
  const type = types[planetIndex];
  const data = PLANET_DATA[type] || PLANET_DATA.webdev;

  useEffect(() => {
    gsap.fromTo(panelRef.current,
      { opacity: 0, x: 64, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
    );
  }, [planetIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 720px)');
    const handleChange = (event) => setIsCompact(event.matches);

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, {
      opacity: 0, x: 60, filter: 'blur(10px)',
      duration: 0.4, ease: 'power2.in',
      onComplete: onClose,
    });
  };

  return (
    <div ref={panelRef} className="planet-panel" style={{
      position: 'fixed',
      right: isCompact ? 'auto' : '26px',
      left: isCompact ? '50%' : 'auto',
      top: isCompact ? 'auto' : '50%',
      bottom: isCompact ? '88px' : 'auto',
      transform: isCompact ? 'translateX(-50%)' : 'translateY(-50%)',
      width: isCompact ? 'calc(100vw - 16px)' : 'min(420px, 92vw)',
      maxHeight: isCompact ? 'calc(100vh - 180px)' : '88vh',
      overflowY: 'auto',
      background: isCompact ? 'rgba(8, 12, 24, 0.92)' : 'rgba(8, 12, 24, 0.78)',
      border: `1px solid rgba(255,255,255,${isCompact ? '0.16' : '0.12'})`,
      borderRadius: isCompact ? '22px' : '28px',
      padding: isCompact ? '16px' : '30px',
      zIndex: 120,
      backdropFilter: 'blur(32px)',
      boxShadow: `0 30px 80px rgba(0,0,0,0.35), inset 0 0 50px rgba(255,255,255,0.04)`,
      scrollbarWidth: 'none',
      WebkitBackdropFilter: 'blur(32px)',
    }}>
      <div style={{ position: 'absolute', inset: '12px', border: `1px solid ${data.color}16`, borderRadius: '16px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: `linear-gradient(90deg, ${data.color}, transparent)` }} />
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: isCompact ? '16px' : '24px', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isCompact ? '9px' : '10px',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            marginBottom: isCompact ? '8px' : '12px',
          }}>
            {data.subtitle}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isCompact ? '20px' : '28px',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.94)',
            lineHeight: 1.05,
            marginBottom: '10px',
          }}>
            {data.title}
          </h2>
        </div>
        <button className="planet-panel-close" onClick={handleClose} style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', color: 'rgba(255,255,255,0.65)',
          width: isCompact ? '34px' : '36px', height: isCompact ? '34px' : '36px', cursor: 'pointer',
          fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = data.color; e.currentTarget.style.color = data.color; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >✕</button>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: isCompact ? '13px' : '14px',
        lineHeight: isCompact ? 1.65 : 1.8,
        color: 'rgba(255,255,255,0.86)',
        marginBottom: isCompact ? '18px' : '24px',
        borderLeft: `3px solid ${data.color}40`,
        paddingLeft: '12px',
      }}>
        {data.description}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: `linear-gradient(90deg, ${data.color}44, transparent)`, marginBottom: isCompact ? '16px' : '20px' }} />

      <div style={{ marginBottom: isCompact ? '18px' : '24px', position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: isCompact ? '9px' : '10px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.32)',
          marginBottom: isCompact ? '12px' : '16px',
        }}>
          SKILLS
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.skills.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: isCompact ? '9px' : '10px',
                letterSpacing: '1px',
                padding: '4px 9px',
                border: `1px solid ${data.color}44`,
                borderRadius: '999px',
                color: `${data.color}dd`,
                background: `${data.color}10`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: `linear-gradient(90deg, ${data.color}44, transparent)`, marginBottom: isCompact ? '16px' : '20px' }} />

      {/* Highlights */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: isCompact ? '9px' : '10px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.32)',
          marginBottom: isCompact ? '12px' : '16px',
        }}>
          SELECTED HIGHLIGHTS
        </h3>
        {data.projects.map((project, i) => (
          <div key={i} style={{
            marginBottom: '12px',
            padding: isCompact ? '12px' : '14px',
            background: isCompact ? `${data.color}10` : `${data.color}08`,
            border: `1px solid ${isCompact ? `${data.color}44` : `${data.color}22`}`,
            borderRadius: isCompact ? '14px' : '6px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${data.color}12`;
            e.currentTarget.style.borderColor = `${data.color}55`;
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `${data.color}08`;
            e.currentTarget.style.borderColor = `${data.color}22`;
            e.currentTarget.style.transform = 'translateX(0)';
          }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: isCompact ? '13px' : '12px', color: 'white', letterSpacing: '1px' }}>
                {project.name}
              </span>
              <a href={project.link} style={{ fontFamily: 'var(--font-mono)', fontSize: isCompact ? '10px' : '9px', color: data.color, textDecoration: 'none', letterSpacing: '1px' }}>
                VIEW →
              </a>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: isCompact ? '12px' : '11px', color: 'rgba(255,255,255,0.72)', marginBottom: '8px', lineHeight: 1.5 }}>
              {project.desc}
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {project.tech.map((t, j) => (
                <span key={j} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  padding: '3px 8px',
                  border: `1px solid ${data.color}55`,
                  borderRadius: '999px',
                  color: `${data.color}dd`,
                  background: `${data.color}10`,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
