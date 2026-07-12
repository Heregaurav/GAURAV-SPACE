import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PLANET_DATA = {
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
        link: '#',
      },
      {
        name: 'Anonymous chat',
        desc: 'Chat anonymously using WebSockets',
        tech: ['Socket.IO', 'Express', 'React'],
        link: '#',
      },
      {
        name: 'Tracely AI',
        desc: 'Showed the vulnerabilites  effectively ',
        tech: ['React', 'Node.js', 'ML'],
        link: '#',
      },
    ],
  },

  cybersec: {
    title: 'CYBERSECURITY',
    subtitle: 'Security & Threat Detection',
    color: '#b6ffdd',
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
        link: '#',
      },
      {
        name: 'Guardian AI',
        desc: 'AI-powered harmful content detection',
        tech: ['RoBERTa', 'Python', 'NLP'],
        link: '#',
      },
      {
        name: 'TryHackMe',
        desc: 'Top 5% global ranking',
        tech: ['Web Security', 'Networking'],
        link: '#',
      },
    ],
  },

  cloud: {
    title: 'DEVOPS',
    subtitle: 'Infrastructure & Deployment',
    color: '#e4c1ff',
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
        link: '#',
      },
      {
        name: 'Containerized Services',
        desc: 'Dockerized full-stack applications',
        tech: ['Docker', 'Node.js'],
        link: '#',
      },
      {
        name: 'Monitoring Stack',
        desc: 'Infrastructure monitoring',
        tech: ['Prometheus', 'Grafana'],
        link: '#',
      },
    ],
  },

  academics: {
    title: 'ACADEMICS',
    subtitle: 'ECE + Cybersecurity',
    color: '#d8957d',
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
        link: '#',
      },
      {
        name: 'Minor in Cybersecurity',
        desc: 'Focused on secure systems and networking',
        tech: ['Cybersecurity', 'Networking'],
        link: '#',
      },
      {
        name: 'Google Cybersecurity Certificate',
        desc: 'Professional certification from Coursera',
        tech: ['Security'],
        link: '#',
      },
    ],
  },

  leadership: {
    title: 'LEADERSHIP',
    subtitle: 'Leadership & Extracurriculars',
    color: '#e95555',
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
        link: '#',
      },
      {
        name: 'MLSA Technical Team',
        desc: 'Conducted workshops on web, cloud, and cybersecurity.',
        tech: ['Workshops', 'Cloud', 'Security'],
        link: '#',
      },
      {
        name: 'College Volleyball Team',
        desc: 'INTER-IIIT team member and junior state-level player.',
        tech: ['Teamwork', 'Sports'],
        link: '#',
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
  const types = ['webdev', 'cybersec', 'cloud', 'electronics', 'leadership'];
  const type = types[planetIndex];
  const data = PLANET_DATA[type] || PLANET_DATA.webdev;

  useEffect(() => {
    gsap.fromTo(panelRef.current,
      { opacity: 0, x: 64, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
    );
  }, [planetIndex]);

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
      right: '26px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'min(420px, 92vw)',
      maxHeight: '88vh',
      overflowY: 'auto',
      background: 'rgba(8, 12, 24, 0.78)',
      border: `1px solid rgba(255,255,255,0.12)`,
      borderRadius: '28px',
      padding: '30px',
      zIndex: 120,
      backdropFilter: 'blur(32px)',
      boxShadow: `0 30px 80px rgba(0,0,0,0.35), inset 0 0 50px rgba(255,255,255,0.04)`,
      scrollbarWidth: 'none',
      WebkitBackdropFilter: 'blur(32px)',
    }}>
      <div style={{ position: 'absolute', inset: '12px', border: `1px solid ${data.color}16`, borderRadius: '16px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: `linear-gradient(90deg, ${data.color}, transparent)` }} />
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            {data.subtitle}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
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
          width: '36px', height: '36px', cursor: 'none',
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
        fontSize: '14px',
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.86)',
        marginBottom: '24px',
        borderLeft: `3px solid ${data.color}40`,
        paddingLeft: '12px',
      }}>
        {data.description}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: `linear-gradient(90deg, ${data.color}44, transparent)`, marginBottom: '20px' }} />

      {/* Skills */}
      {/* <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.32)',
          marginBottom: '16px',
        }}>
          CORE COMPETENCIES
        </h3>
        {data.skills.map((skill, i) => (
          <SkillBar key={skill.name} name={skill.name} level={skill.level} color={data.color} delay={i * 0.1} />
        ))}
      </div> */}

      {/* Divider */}
      <div style={{ height: '1px', background: `linear-gradient(90deg, ${data.color}44, transparent)`, marginBottom: '20px' }} />

      {/* Highlights */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.32)',
          marginBottom: '16px',
        }}>
          SELECTED HIGHLIGHTS
        </h3>
        {data.projects.map((project, i) => (
          <div key={i} style={{
            marginBottom: '12px',
            padding: '14px',
            background: `${data.color}08`,
            border: `1px solid ${data.color}22`,
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            cursor: 'none',
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
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'white', letterSpacing: '1px' }}>
                {project.name}
              </span>
              <a href={project.link} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: data.color, textDecoration: 'none', letterSpacing: '1px' }}>
                VIEW →
              </a>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              {project.desc}
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {project.tech.map((t, j) => (
                <span key={j} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  padding: '2px 8px',
                  border: `1px solid ${data.color}44`,
                  borderRadius: '2px',
                  color: `${data.color}99`,
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
