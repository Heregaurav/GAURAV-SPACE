import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Download, ExternalLink, Send, Check } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { COLORS, FONT } from './theme';

const GitHubIcon = ({ size = 18, strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-4.3 1.3-4.3-2.5-6-3" />
    <path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = ({ size = 18, strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path d="M5 10h2v10H5z" />
    <path d="M10 10h2v1.35h.03c.28-.54 1.01-1.1 2.08-1.1 2.22 0 4.17 1.46 4.17 4.6V20h-2v-8.6c0-2.05-.04-4.69-2.86-4.69-2.86 0-3.3 2.23-3.3 4.53V20h-2z" />
  </svg>
);

const InstagramIcon = ({ size = 18, strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// X (Twitter) doesn't have a matching lucide icon since the rebrand — inline SVG glyph
const XIcon = ({ size = 18, strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="currentColor"
    />
  </svg>
);

// Update these with your real links + Google Drive resume link (make sure sharing is set to "Anyone with the link")
const RESUME_URL = 'https://drive.google.com/file/d/YOUR_FILE_ID/view';
const CONTACT_EMAIL = 'gauravkumar0123xyz@gmail.com';

const SOCIALS = [
  { icon: GitHubIcon, label: 'GitHub', href: 'https://github.com/heregaurav', color: '#ffffff', glow: 'rgba(255,255,255,0.35)' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/gaurav-kumar-182710329/', color: '#4db8ff', glow: 'rgba(10,102,194,0.45)' },
  { icon: XIcon, label: 'X (Twitter)', href: 'https://x.com/GauravKuma5869', color: '#ffffff', glow: 'rgba(255,255,255,0.35)' },
   { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/heregauravv', color: '#e1306c', glow: 'rgba(225,48,108,0.4)' },
  { icon: Mail, label: 'Email', href: `mailto:${CONTACT_EMAIL}`, color: '#00d4ff', glow: 'rgba(0,212,255,0.4)' },
];

function SocialIcon({ icon: Icon, label, href, color, glow }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: `1px solid ${hover ? color : COLORS.line}`,
        color: hover ? color : 'rgba(255,255,255,0.55)',
        background: hover ? 'rgba(255,255,255,0.03)' : 'transparent',
        boxShadow: hover ? `0 0 22px ${glow}` : 'none',
        transform: hover ? 'translateY(-4px) scale(1.06)' : 'translateY(0) scale(1)',
        transition: 'all 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      <Icon size={18} strokeWidth={1.75} />
      <span
        style={{
          position: 'absolute',
          bottom: -26,
          fontFamily: FONT.mono,
          fontSize: '9px',
          letterSpacing: '1.5px',
          whiteSpace: 'nowrap',
          color: 'rgba(255,255,255,0.5)',
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'all 0.22s ease',
          pointerEvents: 'none',
        }}
      >
        {label.toUpperCase()}
      </span>
    </a>
  );
}

function MessageForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

try {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name: form.name,
      email: form.email,
      message: form.message,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );

  setSent(true);
  setForm({
    name: '',
    email: '',
    message: '',
  });

  setTimeout(() => setSent(false), 3000);
} catch (error) {
  console.error('EmailJS send failed:', error);
} finally {
  setLoading(false);
}};

  const fieldStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid rgba(255,255,255,0.12)`,
    borderRadius: '6px',
    padding: '13px 16px',
    color: '#fff',
    fontFamily: FONT.mono,
    fontSize: '13px',
    outline: 'none',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    backgroundClip: 'padding-box',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        maxWidth: 460,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="YOUR NAME"
          required
          style={{ ...fieldStyle, flex: '1 1 180px' }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(0,212,255,0.6)';
            e.target.style.boxShadow = '0 0 16px rgba(0,212,255,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.line;
            e.target.style.boxShadow = 'none';
          }}
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="YOUR EMAIL"
          required
          style={{ ...fieldStyle, flex: '1 1 180px' }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(0,212,255,0.6)';
            e.target.style.boxShadow = '0 0 16px rgba(0,212,255,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.line;
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="SAY SOMETHING..."
        required
        rows={4}
        style={{ ...fieldStyle, resize: 'vertical', fontFamily: FONT.mono }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(0,212,255,0.6)';
          e.target.style.boxShadow = '0 0 16px rgba(0,212,255,0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = COLORS.line;
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontFamily: FONT.display,
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '2px',
          padding: '15px 32px',
          background: sent
            ? 'linear-gradient(135deg, rgba(80,220,140,0.25), rgba(80,220,140,0.1))'
            : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(180,79,255,0.15))',
          border: `1px solid ${sent ? 'rgba(80,220,140,0.6)' : 'rgba(0,212,255,0.5)'}`,
          borderRadius: '6px',
          color: '#ffffff',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.85 : 1,
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        onMouseEnter={(e) => {
          if (!sent) e.currentTarget.style.boxShadow = '0 0 35px rgba(0,212,255,0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {sent ? <Check size={16} /> : <Send size={16} />}
        {loading ? 'SENDING...' : sent ? 'MESSAGE SENT!' : 'SEND MESSAGE'}
      </button>
      <p
        style={{
          fontFamily: FONT.mono,
          fontSize: '10px',
          letterSpacing: '1px',
          color: COLORS.textFaint,
          textAlign: 'center',
        }}
      >
       
      </p>
    </form>
  );
}

export default function ConnectSection() {
  return (
    <SectionWrapper
      id="connect"
      index="07"
      eyebrow="Get In Touch"
      title="Let's build something"
      description="Open to internships, collaborations, and interesting problems. Reach out — the signal's monitored."
      align="center"
    >
      <div
        data-reveal
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          width: '100%',
        }}
      >
        {/* Resume actions */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: FONT.display,
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '2px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(180,79,255,0.15))',
              border: '1px solid rgba(0,212,255,0.5)',
              borderRadius: '6px',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0,212,255,0.45)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ExternalLink size={16} /> VIEW RESUME
          </a>

          <a
            href={RESUME_URL.replace('/view', '/export?format=pdf')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: FONT.mono,
              fontSize: '12px',
              letterSpacing: '2px',
              padding: '16px 28px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${COLORS.line}`,
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.line;
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
            }}
          >
            <Download size={15} /> DOWNLOAD
          </a>
        </div>

        {/* Socials */}


        {/* Divider */}
        <div
          style={{
            width: '100%',
            maxWidth: 460,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.line}, transparent)`,
          }}
        />

        {/* Message form */}
        <MessageForm />

        {/* Divider */}
        <div
          style={{
            width: '100%',
            maxWidth: 460,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.line}, transparent)`,
          }}
        />




        <div style={{ display: 'flex', gap: '30px', paddingBottom: '10px' }}>
          {SOCIALS.map((s) => (
            <SocialIcon key={s.label} {...s} />
          ))}
        </div>

        <div
          style={{
            marginTop: '10px',
            fontFamily: FONT.mono,
            fontSize: '10px',
            letterSpacing: '2px',
            color: COLORS.textFaint,
          }}
        >
          END OF TRANSMISSION
        </div>
      </div>
    </SectionWrapper>
  );
}