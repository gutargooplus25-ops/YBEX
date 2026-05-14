import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const THEME_COLOR = '#7D4CF6';

// --- Data Models ---
const teamPillars = [
  {
    id: 'talent-acquisition',
    icon: '👥',
    title: 'Talent Acquisition',
    description: 'We don’t just post job ads. We scout, vet, and hire top-tier videographers, editors, and creators who perfectly match your brand’s DNA.'
  },
  {
    id: 'studio-build',
    icon: '🎙️',
    title: 'Studio Architecture',
    description: 'From acoustic treatment and professional lighting to camera rigs and set design. We transform your empty office room into a high-end production studio.'
  },
  {
    id: 'systems-sops',
    icon: '⚙️',
    title: 'Systems & SOPs',
    description: 'We install our exact agency workflows. Content calendars, notion boards, script formulas, and fast-feedback editing loops so your team runs like a machine.'
  },
  {
    id: 'training',
    icon: '📈',
    title: 'Training & Handover',
    description: 'We don’t just hire and leave. We actively train your new team on platform algorithms, hook psychology, and retention editing before handing over the keys.'
  }
];

const rolloutProcess = [
  { phase: 'Phase 1', title: 'Discovery & Blueprint', desc: 'We audit your workspace, define the content goals, and set the budget for talent and gear.' },
  { phase: 'Phase 2', title: 'Scouting & Procurement', desc: 'We begin interviewing creators while simultaneously ordering the cameras, lights, and audio gear.' },
  { phase: 'Phase 3', title: 'Studio Construction', desc: 'Our team arrives on-site to build the set, treat the acoustics, and wire the entire production setup.' },
  { phase: 'Phase 4', title: 'Onboarding & Bootcamp', desc: 'Your new hires arrive. We run them through an intensive bootcamp on your brand voice and workflows.' },
  { phase: 'Phase 5', title: 'Live Production', desc: 'The team goes live. We oversee the first few batches of content to ensure premium quality, then step back.' }
];

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function InHouseTeam() {
  return (
    <section className="page-shell classic-inhouse-page">
      
      {/* Soft Ambient Background Glow */}
      <div className="ambient-glow" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* ══ HERO SECTION ══ */}
        <motion.div 
          className="hero-section"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span className="eyebrow" style={{ color: THEME_COLOR }}>The In-House Model</span>
          <h1 className="classic-heading">Build your own content engine.</h1>
          <p className="classic-desc mx-auto">
            Don't just outsource forever. Let us build, equip, and train a world-class creator team right inside your own office. Own your production, scale your volume, and move faster.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="submit-btn inline-btn">
              Start Building Your Team
            </Link>
          </div>
        </motion.div>

        {/* ══ 4 PILLARS GRID ══ */}
        <motion.div 
          className="pillars-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teamPillars.map((pillar) => (
            <motion.div key={pillar.id} className="pillar-card" variants={fadeUp}>
              <div className="pillar-icon" style={{ backgroundColor: `rgba(125, 76, 246, 0.1)`, borderColor: `rgba(125, 76, 246, 0.3)` }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 500 }}>{pillar.title}</h3>
              <p style={{ color: '#888', lineHeight: 1.6, fontSize: '1rem', margin: 0 }}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ══ THE ROLLOUT PROCESS ══ */}
        <motion.div 
          className="rollout-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="rollout-header">
            <span className="eyebrow" style={{ color: THEME_COLOR }}>The Timeline</span>
            <h2>From empty room to live production in 30 days.</h2>
          </div>

          <div className="process-timeline">
            {rolloutProcess.map((step, index) => (
              <motion.div key={index} className="timeline-step" variants={fadeUp}>
                <div className="step-number" style={{ color: THEME_COLOR }}>0{index + 1}</div>
                <div className="step-content">
                  <span className="step-phase" style={{ color: THEME_COLOR }}>{step.phase}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══ BOTTOM CTA ══ */}
        <motion.div 
          className="bottom-cta-card"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2>Stop renting attention. Start owning it.</h2>
          <p>Book a consultation to discuss your office space, budget, and content goals.</p>
          <Link to="/contact" className="submit-btn inline-btn outline-btn">
            Talk to an Expert
          </Link>
        </motion.div>

      </div>

      {/* --- Embedded Premium Styles --- */}
      <style>{`
        .classic-inhouse-page {
          position: relative;
          padding: 120px 0;
          background-color: #050505;
          color: #ffffff;
          overflow: hidden;
        }

        .ambient-glow {
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 60%;
          background: radial-gradient(ellipse at top, rgba(125, 76, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* Typography */
        .eyebrow {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1.5rem;
          display: block;
        }

        .classic-heading {
          font-size: clamp(3rem, 5vw, 4.5rem);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem 0;
        }

        .classic-desc {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #999999;
          max-width: 700px;
          margin-bottom: 3rem;
        }

        .mx-auto { margin-left: auto; margin-right: auto; }

        /* Hero */
        .hero-section {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 100px;
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        /* Buttons */
        .submit-btn {
          background: ${THEME_COLOR};
          color: #ffffff;
          border: 1px solid transparent;
          padding: 1.1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .submit-btn:hover {
          background: #6a3fe0;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(125, 76, 246, 0.2);
        }

        .outline-btn {
          background: transparent;
          border: 1px solid ${THEME_COLOR};
          color: ${THEME_COLOR};
        }

        .outline-btn:hover {
          background: rgba(125, 76, 246, 0.1);
        }

        /* Pillars Grid */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 120px;
        }

        .pillar-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.3s ease;
        }

        .pillar-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(125, 76, 246, 0.3);
          transform: translateY(-5px);
        }

        .pillar-icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          border: 1px solid transparent;
          margin-bottom: 1.5rem;
        }

        /* Rollout Timeline */
        .rollout-section {
          max-width: 800px;
          margin: 0 auto 120px;
        }

        .rollout-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .rollout-header h2 {
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 500;
          margin: 0;
        }

        .process-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .timeline-step {
          display: flex;
          gap: 2rem;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2.5rem;
          align-items: flex-start;
          transition: border-color 0.3s ease;
        }

        .timeline-step:hover {
          border-color: rgba(125, 76, 246, 0.4);
        }

        .step-number {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 0.8;
          opacity: 0.3;
          font-family: 'Syne', sans-serif;
        }

        .step-content {
          flex: 1;
        }

        .step-phase {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: block;
        }

        .step-content h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .step-content p {
          color: #888;
          line-height: 1.6;
          margin: 0;
        }

        /* Bottom CTA */
        .bottom-cta-card {
          text-align: center;
          background: linear-gradient(180deg, rgba(125, 76, 246, 0.08) 0%, rgba(0,0,0,0) 100%);
          border: 1px solid rgba(125, 76, 246, 0.2);
          border-radius: 30px;
          padding: 5rem 2rem;
        }

        .bottom-cta-card h2 {
          font-size: clamp(2rem, 3vw, 2.5rem);
          font-weight: 500;
          margin: 0 0 1rem 0;
        }

        .bottom-cta-card p {
          color: #888;
          font-size: 1.1rem;
          margin: 0 auto 2.5rem;
          max-width: 500px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .timeline-step {
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem;
          }
          .step-number {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
}