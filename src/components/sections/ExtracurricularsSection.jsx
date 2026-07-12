import { useState } from "react";
import { Users, Music, Trophy, Sparkles, Award, Volleyball } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { COLORS, FONT } from "./theme";

const ITEMS = [
  {
    icon: Users,
    title: "Leadership",
    subtitle: "Building teams that build things",
    frontColor: "#8B5CF6",
    details: [
      "Led the college Dance club ,learnt alot ",
      "Led multiple college project ,",
      "Collaborated across design, frontend & backend.",
      "Focused on ownership, communication & execution.",
    ],
    skills: [
      "Leadership",
      "Team Management",
      "Communication",
      "Project Planning",
      "Decision Making",
    ],
  },

  {
    icon: Music,
    title: "Dance Club Lead",
    subtitle: "Performance meets discipline",
    frontColor: "#EC4899",
    details: [
      "Lead of Dynamight Dance Club.",
      "Mentored juniors and coordinated practices.",
      "Managed choreography for college performances.",
      "Won Inter-College Dance Competition.",
      "Organized events & rehearsals.",
    ],
    skills: [
      "Mentorship",
      "Creativity",
      "Coordination",
      "Public Performance",
      "Team Spirit",
    ],
  },

  {
    icon: Trophy,
    title: "Sports",
    subtitle: "Compete. Improve. Repeat.",
    frontColor: "#F59E0B",
    details: [
      "Member of IIIT Dharwad Volleyball Team.",
      "Strong believer in consistency over intensity.",
      "Learned discipline through competitive sports.",
      "Applied sports mindset to DSA preparation.",
      "Continuous self-improvement mentality.",
    ],
    skills: [
      "Discipline",
      "Consistency",
      "Resilience",
      "Teamwork",
      "Focus",
    ],
  },
];

export default function ExtracurricularsSection() {
  const [flippedCard, setFlippedCard] = useState(null);

  const toggleCard = (title) => {
    setFlippedCard((current) => (current === title ? null : title));
  };

  return (
    <SectionWrapper
      id="extracurriculars"
      index="05"
      eyebrow="Beyond the Terminal"
      title="Extracurriculars"
      description="Leadership, creativity and teamwork beyond coding."
    >
      <>
        <style>{`
          .flip-grid{
              display:grid;
              grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
              gap:28px;
              perspective:1200px;
          }

          .flip-card{
              height:360px;
              perspective:1200px;
          }

          .flip-inner{
              position:relative;
              width:100%;
              height:100%;
              transition:transform .8s cubic-bezier(.4,.2,.2,1);
              transform-style:preserve-3d;
          }

          .flip-card:hover .flip-inner{
              transform:rotateY(180deg);
          }

          .flip-card.is-flipped .flip-inner{
              transform:rotateY(180deg);
          }

          .flip-front,
          .flip-back{
              position:absolute;
              inset:0;
              border-radius:24px;
              backface-visibility:hidden;
              overflow:hidden;
              display:flex;
              flex-direction:column;
              justify-content:center;
              align-items:center;
              padding:28px;

              background:rgba(255,255,255,.04);
              backdrop-filter:blur(18px);
              border:1px solid rgba(255,255,255,.08);

              box-shadow:
                  0 10px 40px rgba(0,0,0,.35),
                  inset 0 1px rgba(255,255,255,.06);

              transition:.35s;
          }

          .flip-card:hover .flip-front,
          .flip-card:hover .flip-back{
              box-shadow:
                  0 18px 55px rgba(180,79,255,.18),
                  inset 0 1px rgba(255,255,255,.08);
          }

          .flip-back{
              transform:rotateY(180deg);
              align-items:flex-start;
          }

          .glow-circle{
              width:82px;
              height:82px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              margin-bottom:26px;
              position:relative;
          }

          .glow-circle::after{
              content:'';
              position:absolute;
              width:100%;
              height:100%;
              border-radius:50%;
              filter:blur(22px);
              opacity:.45;
              z-index:-1;
          }

          .chip{
              padding:6px 12px;
              border-radius:999px;
              background:rgba(255,255,255,.06);
              border:1px solid rgba(255,255,255,.08);
              font-size:12px;
              color:${COLORS.textPrimary};
          }

          .skills{
              display:flex;
              flex-wrap:wrap;
              gap:8px;
              margin-top:18px;
          }

          .back-list{
              margin:16px 0 0;
              padding-left:18px;
              color:${COLORS.textDim};
              line-height:1.8;
              font-size:13px;
          }

          .flip-title{
              font-family:${FONT.display};
              font-size:22px;
              font-weight:800;
              margin:0;
              color:${COLORS.textPrimary};
          }

          .flip-sub{
              margin-top:10px;
              text-align:center;
              color:${COLORS.textDim};
              line-height:1.7;
              font-size:14px;
          }

          .flip-back h3{
              font-family:${FONT.display};
              margin:0;
              color:${COLORS.textPrimary};
              font-size:20px;
          }

          .flip-back p{
              margin:8px 0;
              color:${COLORS.neonPurple};
              font-size:13px;
              letter-spacing:.12em;
              text-transform:uppercase;
          }

          @media(max-width:768px){

              .flip-card{
                  height:400px;
                  cursor:pointer;
                  touch-action:manipulation;
              }

              .flip-card:hover .flip-inner{
                  transform:none;
              }

          }
        `}</style>

        <div className="flip-grid">
          {ITEMS.map(({ icon: Icon, title, subtitle, details, skills, frontColor }) => (
            <div
              className={`flip-card ${flippedCard === title ? "is-flipped" : ""}`}
              key={title}
              onClick={() => toggleCard(title)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleCard(title);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={flippedCard === title}
              aria-label={`Toggle details for ${title}`}
            >
              <div className="flip-inner">

                {/* FRONT */}

                <div className="flip-front">

                  <div
                    className="glow-circle"
                    style={{
                      background: `${frontColor}22`,
                      border: `1px solid ${frontColor}55`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: frontColor,
                        filter: "blur(30px)",
                        opacity: 0.25,
                        borderRadius: "50%",
                      }}
                    />

                    <Icon
                      size={38}
                      color={frontColor}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h2 className="flip-title">
                    {title}
                  </h2>

                  <div className="flip-sub">
                    {subtitle}
                  </div>

                  <div
                    style={{
                      marginTop: 34,
                      color: COLORS.neonPurple,
                      fontSize: 13,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                    }}
                  >
                    Hover to Flip →
                  </div>

                </div>

                {/* BACK */}

                <div className="flip-back">

                  <h3>{title}</h3>

                  <p>Highlights</p>

                  <ul className="back-list">
                    {details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="skills">
                    {skills.map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </>
    </SectionWrapper>
  );
}