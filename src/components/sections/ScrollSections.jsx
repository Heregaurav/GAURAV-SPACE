import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import CodingProfileSection from './CodingProfileSection';
import TechnologiesSection from './TechnologiesSection';
import ExtracurricularsSection from './ExtracurricularsSection';
import ExperienceSection from './ExperienceSection';
import ConnectSection from './ConnectSection';
// Note: Starfield and world are rendered by the global Canvas so sections
// render as normal document content without their own starfield overlay.

/**
 * Everything that lives BELOW the fixed hero. Renders in normal document
 * flow so the page scrolls; the 3D canvas + LandingUI stay position:fixed
 * behind/above it. See INTEGRATION.md for how to wire this into App.jsx.
 *
 * Background is a fixed, layered dotted starfield (StarfieldBackground)
 * instead of a flat color, so the whole scrollable page keeps reading as
 * "space" rather than switching to a plain dark panel once you scroll
 * past the hero.
 */
export default function ScrollSections() {
  return (
    <div style={{ position: 'relative', zIndex: 5, background: 'transparent', overflow: 'hidden' }}>
      <div style={{ position: 'relative', isolation: 'isolate' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AboutSection />
          <ProjectsSection />
          <CodingProfileSection />
          <TechnologiesSection />
          <ExperienceSection />
          <ExtracurricularsSection />
          <ConnectSection resumeHref="/resume.pdf" />
        </div>
      </div>
    </div>
  );
}