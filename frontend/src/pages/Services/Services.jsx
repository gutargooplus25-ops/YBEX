import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const THEME_COLOR = '#7D4CF6';

const ybexServices = [
  {
    id: 'brand-identity',
    eyebrow: 'ब्रांड पहचान',
    title: 'Brand Identity',
    description: 'Logo, visual identity, brand guidelines — everything your brand needs to look legendary from day one.',
    tags: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Packaging Design', 'Brand Voice']
  },
  {
    id: 'brand-strategy',
    eyebrow: 'ब्रांड रणनीति',
    title: 'Brand Strategy',
    description: 'Deep market research, competitor analysis, positioning — we map exactly where your brand fits and how to win.',
    tags: ['Market Research', 'Competitor Analysis', 'Brand Positioning', 'Audience Mapping', 'Growth Roadmap']
  },
  {
    id: 'content-creation',
    eyebrow: 'कंटेंट क्रिएशन',
    title: 'Content Creation',
    description: 'Reels, videos, photoshoots, copywriting — content that stops the scroll and gets real results.',
    tags: ['Reels & Videos', 'Brand Photography', 'Copywriting', 'YouTube Content', 'Ad Creatives']
  },
  {
    id: 'paid-pr',
    eyebrow: 'पेड पीआर',
    title: 'Paid PR',
    description: 'Get featured on top publications, news sites, and media houses. Build authority that money can\'t fake.',
    tags: ['News Placements', 'Press Releases', 'Publication Outreach', 'Brand Story', 'Authority Building']
  },
  {
    id: 'talent-marketing',
    eyebrow: 'टैलेंट मार्केटिंग',
    title: 'Talent Marketing',
    description: 'We connect brands with the right creators — scouting, pitching, managing deals, and measuring impact end-to-end.',
    tags: ['Creator Discovery', 'Campaign Strategy', 'Deal Negotiation', 'Content Review', 'ROI Tracking']
  },
  {
    id: 'social-media',
    eyebrow: 'सोशल मीडिया',
    title: 'Social Media',
    description: 'Full social media management — strategy, daily content, community, and consistent growth.',
    tags: ['Platform Strategy', 'Daily Calendar', 'Community Mgmt', 'Hashtags', 'Monthly Reports']
  },
  {
    id: 'website-tech',
    eyebrow: 'वेबसाइट और टेक',
    title: 'Website & Tech',
    description: 'High-converting websites, landing pages, and e-com stores that look premium and perform even better.',
    tags: ['Website Design', 'E-commerce Stores', 'Landing Pages', 'Website SEO', 'Speed Optimization']
  },
  {
    id: 'studio-setups',
    eyebrow: 'स्टूडियो सेटअप',
    title: 'Studio Setups',
    description: 'Professional creator studios at your location. Acoustics, lighting, gear — we build the full setup.',
    tags: ['Acoustic Treatment', 'Pro Lighting', 'Camera Advisory', 'Creator Desks', 'Workflow Setup']
  },
  {
    id: 'performance-marketing',
    eyebrow: 'परफॉरमेंस मार्केटिंग',
    title: 'Performance Marketing',
    description: 'Google Ads, Meta Ads, data-driven campaigns with real ROAS. We spend your money like it\'s ours.',
    tags: ['Google & Meta Ads', 'Conversion Opt.', 'Funnel Strategy', 'Retargeting', 'Weekly Analytics']
  },
  {
    id: 'talent-growth',
    eyebrow: 'टैलेंट ग्रोथ',
    title: 'Talent Growth',
    description: 'For creators, founders, and athletes who want to build a personal brand that actually pays.',
    tags: ['Personal Brand', 'Platform Growth', 'Monetization', 'Partnerships', 'Audience Building']
  },
  {
    id: 'ugc-services',
    eyebrow: 'यूजीसी सर्विसेज',
    title: 'UGC Services',
    description: 'User-generated style content that feels real, converts better, and costs less than traditional ads. Built for D2C brands.',
    tags: ['UGC Video', 'Authentic Briefs', 'Product Demos', 'Testimonial Ads', 'Ad Assets']
  }
];

const ybexTimeline = [
  { day: 'Day 1-2', phase: 'Brand Audit', desc: 'We deep-dive into your brand. No filter. Just truth.' },
  { day: 'Day 3-4', phase: 'Strategy Design', desc: 'We build a custom growth plan from scratch.' },
  { day: 'Day 5-6', phase: 'Content & Creative', desc: 'Visuals, copy, and creatives designed for impact.' },
  { day: 'Day 7-8', phase: 'Launch & Execute', desc: 'We go live — campaigns, posts, influencers. Full push.' },
  { day: 'Day 9', phase: 'Results & Reveal', desc: 'You see the transformation. Numbers don\'t lie.' }
];

// Reusable Animation Variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const lineVariant = {
  hidden: { height: 0 },
  visible: { 
    height: '100%', 
    transition: { duration: 1.5, ease: 'easeInOut' } 
  }
};

export default function Services() {
  return (
    <section className="page-shell">
      <style>{`
        .theme-accent { color: ${THEME_COLOR} !important; }
        .theme-bg { background-color: ${THEME_COLOR} !important; }
        .theme-border { border-color: ${THEME_COLOR} !important; }
        
        .feature-card {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .feature-card:hover { 
          border-color: ${THEME_COLOR} !important; 
          box-shadow: 0 8px 30px rgba(125, 76, 246, 0.12);
          transform: translateY(-4px);
        }
        
        .service-tags { display: flex; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
        .service-tag { 
          font-size: 11px; 
          font-weight: 600; 
          padding: 6px 10px; 
          border-radius: 6px; 
          background: rgba(125, 76, 246, 0.08); 
          color: ${THEME_COLOR}; 
        }
        
        .timeline-wrapper { position: relative; margin: 40px auto 0; max-width: 600px; padding-left: 32px; }
        .timeline-track {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background: rgba(125, 76, 246, 0.15);
        }
        .timeline-progress {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          background: ${THEME_COLOR};
        }
        .timeline-node {
          position: relative;
          padding-bottom: 40px;
        }
        .timeline-node:last-child { padding-bottom: 0; }
        .timeline-dot {
          position: absolute;
          left: -37px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${THEME_COLOR};
          box-shadow: 0 0 0 4px rgba(125, 76, 246, 0.2);
        }
        .process-header { display: flex; align-items: baseline; gap: 16px; margin-bottom: 8px; }
        .process-day { font-size: 13px; font-weight: 700; color: ${THEME_COLOR}; text-transform: uppercase; letter-spacing: 1.2px; }
        .process-header h3 { margin: 0; font-size: 1.25rem; }

        .inhouse-inline-cta {
          margin-top: 48px;
          padding: 32px;
          background: rgba(125, 76, 246, 0.05);
          border: 1px solid rgba(125, 76, 246, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          transition: all 0.3s ease;
        }
        .inhouse-inline-cta:hover {
          border-color: rgba(125, 76, 246, 0.4);
          background: rgba(125, 76, 246, 0.08);
        }
        .inhouse-inline-btn {
          padding: 12px 24px;
          background-color: transparent;
          color: ${THEME_COLOR};
          border: 1px solid ${THEME_COLOR};
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .inhouse-inline-btn:hover {
          background-color: ${THEME_COLOR};
          color: #fff;
          box-shadow: 0 8px 20px rgba(125, 76, 246, 0.2);
        }

        @media (max-width: 640px) {
          .inhouse-inline-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="container">
        {/* Hero Section */}
        <motion.div 
          className="section-heading page-heading" 
          variants={fadeUpVariant}
          initial="hidden" 
          animate="visible"
        >
          <p className="eyebrow theme-accent">Our Services</p>
          <h1>Just execution that moves the needle for your brand.</h1>
          <p className="section-copy">
            We handle everything in-house — strategy, content, design, influencer management, and execution. Real creators. Real results. No ghosting.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="feature-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {ybexServices.map((service) => (
            <motion.article
              key={service.id}
              className="feature-card"
              variants={fadeUpVariant}
            >
              <p className="theme-accent" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                {service.eyebrow}
              </p>
              <h3 style={{ marginBottom: '12px' }}>{service.title}</h3>
              <span style={{ color: 'var(--text-secondary, #666)', lineHeight: 1.6 }}>
                {service.description}
              </span>
              <div className="service-tags">
                {service.tags.map(tag => (
                  <span key={tag} className="service-tag">{tag}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Animated Timeline Section (Now with embedded In-House CTA) */}
        <motion.div 
          className="detail-grid" 
          style={{ marginTop: '80px', display: 'block' }} 
          variants={fadeUpVariant}
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="detail-panel" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p className="eyebrow theme-accent">The Process</p>
              <h2>Hand us your brand and watch what happens.</h2>
            </div>
            
            <div className="timeline-wrapper">
              <div className="timeline-track" />
              <motion.div 
                className="timeline-progress"
                variants={lineVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
              />
              
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {ybexTimeline.map((step, idx) => (
                  <motion.div key={idx} className="timeline-node" variants={fadeUpVariant}>
                    <motion.div 
                      className="timeline-dot" 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.2 + (idx * 0.1), type: 'spring' }}
                      viewport={{ once: true }}
                    />
                    <div className="process-header">
                      <span className="process-day">{step.day}</span>
                      <h3>{step.phase}</h3>
                    </div>
                    <span style={{ color: 'var(--text-secondary, #666)' }}>{step.desc}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Seamless Inline In-House CTA attached directly below the timeline */}
              <motion.div 
                className="inhouse-inline-cta"
                variants={fadeUpVariant}
              >
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Want to bring this magic in-house?</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary, #888)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    We help you hire, train, design the studio, and set up a full-time creator team right in your office.
                  </p>
                </div>
                <Link to="/inhouse-team" className="inhouse-inline-btn">
                  Know More →
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* Pitch Us CTA */}
        <motion.div 
          className="page-cta" 
          style={{ marginTop: '80px', display: 'flex', justifyContent: 'center' }}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link to="/contact" className="button button-primary theme-bg theme-border">
            Pitch Us Your Idea
          </Link>
        </motion.div>

        {/* Invoice CTA */}
        <motion.div
          className="invoice-cta-section"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginTop: '64px' }}
        >
          <div className="invoice-cta-card" style={{ borderColor: 'rgba(125, 76, 246, 0.15)' }}>
            <div className="invoice-cta-icon" style={{ color: THEME_COLOR }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="invoice-cta-text">
              <h4>Need to bill a client?</h4>
              <p>Create professional invoices in seconds</p>
            </div>
            <Link to="/invoice" className="button button-primary invoice-compact-btn" style={{ backgroundColor: 'transparent', color: THEME_COLOR, borderColor: THEME_COLOR }}>
              Generate Invoice
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}