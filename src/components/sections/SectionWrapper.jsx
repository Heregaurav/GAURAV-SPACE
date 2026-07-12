import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS, FONT, eyebrowStyle, sectionTitleStyle } from './theme';

gsap.registerPlugin(ScrollTrigger);

/**
 * Consistent scaffold every scroll section uses: index tag, eyebrow label,
 * title, optional description, hex-grid backdrop, and a scroll-triggered
 * fade/rise-in so sections animate in the same language as the hero.
 */
export default function SectionWrapper({
  id,
  index,        // e.g. "02" — informative here because sections ARE an ordered journey
  eyebrow,
  title,
  description,
  children,
  align = 'left', // 'left' | 'center'
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 32, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 7vw, 90px)',
        boxSizing: 'border-box',
        overflow: 'visible',
      }}
    >
      {/* faint corner index — informative: this IS a numbered journey through the profile */}

      <div
        data-reveal
        style={{
          textAlign: align,
          maxWidth: align === 'center' ? '640px' : '720px',
          margin: align === 'center' ? '0 auto 56px' : '0 0 56px',
        }}
      >
        <div style={{ ...eyebrowStyle, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          <span style={{ display: 'inline-block', width: '30px', height: '1px', background: COLORS.neonBlue }} />
          {eyebrow}
        </div>
        <h2 style={sectionTitleStyle}>{title}</h2>
        {description && (
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: '15px',
              lineHeight: 1.7,
              color: COLORS.textDim,
              maxWidth: '560px',
              margin: align === 'center' ? '0 auto' : 0,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
