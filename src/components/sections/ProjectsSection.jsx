import { ExternalLink, Code2, ShieldCheck, Rocket, Boxes , MessageCircle } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { COLORS, FONT, glassPanel } from './theme';

const PROJECTS = [
  {
    icon: ShieldCheck,
    title: 'Tracely AI',
    tag: 'Cybersecurity · UEBA',
    description:
      'An AI-powered User & Entity Behavior Analytics (UEBA) platform that detects insider threats using behavioral anomaly detection. Built with Isolation Forest and Autoencoder models on the CERT insider-threat dataset, featuring a real-time dashboard for alerts, risk scoring, timelines, and security analytics.',
    stack: [
      'Python',
      'React',
      'Flask',
      'Isolation Forest',
      'Autoencoder',
      'CERT Dataset',
    ],
    links: {
      code: 'https://github.com/Heregaurav/Tracely-AI',
      live: 'https://tracely-ai.vercel.app/',
    },
    featured: true,
  },
  {
    icon: Rocket,
    title: 'Inkwell',
    tag: 'Full Stack · Cloud Native',
    description:
      'An AI-powered platform for readers and writers to publish articles, engage in discussions, and explore knowledge-driven content. Includes AI-generated summaries, key-point extraction, exam-focused insights, and a scalable cloud-native infrastructure deployed on AWS using Docker, Kubernetes (EKS), and Terraform.',
    stack: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Socket.IO',
      'Docker',
      'Kubernetes',
      'AWS',
      'Terraform',
    ],
    links: {
      code: 'https://github.com/Heregaurav/inkwell',
      live: 'https://myinkwell.vercel.app/',
    },
    featured: true,
  },
  {
    icon: Boxes,
    title: 'Guardian AI',
    tag: 'AI · Content Moderation',
    description:
      'A real-time intelligent chat platform that leverages a fine-tuned RoBERTa model to detect abusive, toxic, and harmful messages. Includes an admin dashboard for monitoring flagged conversations while maintaining privacy-focused moderation and secure handling of user data.',
    stack: [
      'Python',
      'RoBERTa',
      'NLP',
      'React',
      'Real-time Chat',
    ],
    links: {
      code: 'https://github.com/Heregaurav/Guardian-AI',
      live: '#',
    },
    featured: true,
  },
  {
  icon: MessageCircle ,
  title: 'VOID',
  tag: 'Anonymous Chat App',
  description:
    'A secure real-time anonymous chatting platform built with Socket.IO, enabling instant peer-to-peer conversations without requiring user identities. Features live messaging, room-based communication, responsive UI, and efficient WebSocket-based event handling for a seamless chat experience.',
  stack: [
    'React',
    'Node.js',
    'Express',
    'Socket.IO',
    'MongoDB',
  ],
  links: {
    code: 'https://github.com/Heregaurav/VOID',
    live: 'https://void25.vercel.app',
  },
  featured: true,
},
];

function ProjectCard({ project }) {
  const Icon = project.icon;
  return (
    <div
      data-reveal
      style={{
        ...glassPanel,
        padding: '26px',
        display: 'flex',
        flexDirection: 'column',
        gridColumn: project.featured ? 'span 1' : 'span 1',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.08)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.line;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,212,255,0.06)',
          border: '1px solid rgba(0,212,255,0.2)',
          marginBottom: '18px',
        }}
      >
        <Icon size={20} color={COLORS.neonBlue} strokeWidth={1.75} />
      </div>

      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: '10px',
          letterSpacing: '1.5px',
          color: COLORS.textFaint,
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {project.tag}
      </div>

      <h3
        style={{
          fontFamily: FONT.display,
          fontSize: '19px',
          fontWeight: 800,
          color: COLORS.textPrimary,
          margin: '0 0 10px',
        }}
      >
        {project.title}
      </h3>

      <p
        style={{
          fontFamily: FONT.body,
          fontSize: '13.5px',
          lineHeight: 1.7,
          color: COLORS.textDim,
          margin: '0 0 18px',
          flexGrow: 1,
        }}
      >
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {project.stack.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: FONT.mono,
              fontSize: '9.5px',
              letterSpacing: '0.5px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${COLORS.line}`,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '18px' }}>
        {project.links.code && (
          <a
            href={project.links.code}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: FONT.mono,
              fontSize: '11px',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
            }}
          >
            <Code2 size={14} /> CODE
          </a>
        )}
        {project.links.live && (
          <a
            href={project.links.live}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: FONT.mono,
              fontSize: '11px',
              letterSpacing: '1px',
              color: COLORS.neonBlue,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={14} /> LIVE
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <SectionWrapper
      id="projects"
      index="02"
      eyebrow="Selected Work"
      title="Things I've built"
      description="A mix of security engineering and interactive frontend — favoring projects with real technical depth."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </SectionWrapper>
  );
}
