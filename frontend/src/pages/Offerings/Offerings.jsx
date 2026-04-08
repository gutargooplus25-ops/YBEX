import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

const offerings = [
  {
    id: 'brand-challenge',
    icon: '🚀',
    tag: 'Most Popular',
    title: '9-Day Brand Challenge',
    description:
      'A focused 9-day intensive program designed to build, refine, and launch your brand identity from scratch. Perfect for startups and solopreneurs ready to make their mark.',
    points: ['Brand strategy & positioning', 'Visual identity creation', 'Launch-ready brand kit'],
  },
  {
    id: 'creators-academy',
    icon: '🎓',
    tag: 'For Creators',
    title: 'Creators Academy',
    description:
      'A comprehensive learning hub for content creators. Master storytelling, video production, social media strategy, and monetization — all in one place.',
    points: ['Expert-led live sessions', 'Content creation frameworks', 'Monetization strategies'],
  },
  {
    id: 'in-house-team',
    icon: '👥',
    tag: 'For Businesses',
    title: 'In House Team',
    description:
      'Get a dedicated team of designers, developers, and strategists working exclusively on your brand. Scale without the overhead of hiring full-time staff.',
    points: ['Dedicated design & dev team', 'Flexible monthly plans', 'Direct Slack communication'],
  },
  {
    id: 'idea-pitch',
    icon: '💡',
    tag: 'For Founders',
    title: 'Idea Pitch',
    description:
      'Have a business idea? Pitch it to our panel of experts and investors. Get feedback, mentorship, and potential funding to turn your vision into reality.',
    points: ['Expert panel feedback', 'Investor introductions', 'Pitch deck support'],
  },
];

export default function Offerings() {
  return (
    <Layout>
      {/* Hero */}
      <section style={{
        padding: '6rem 1.5rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(88,84,156,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }} className="animate-fade-up">
          <span className="badge">What We Offer</span>
          <h1 className="section-title">Our Offerings</h1>
          <p className="section-sub">
            Tailored programs and services built to accelerate your growth at every stage.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '1.5rem',
        }}>
          {offerings.map(({ id, icon, tag, title, description, points }, i) => (
            <div
              key={id}
              id={id}
              className="card animate-fade-up"
              style={{
                padding: '2.5rem',
                opacity: 0,
                animationDelay: `${i * 120}ms`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  width: '56px', height: '56px',
                  backgroundColor: 'rgba(88,84,156,0.2)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                }}>
                  {icon}
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#58549C',
                  backgroundColor: 'rgba(88,84,156,0.12)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                }}>
                  {tag}
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{title}</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
                {description}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                {points.map((pt) => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ color: '#58549C', fontWeight: 700 }}>✓</span>
                    {pt}
                  </li>
                ))}
              </ul>

              <Link
                to="/get-started"
                className="btn-primary"
                style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.625rem 1.5rem' }}
              >
                Get Started
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
