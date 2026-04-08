import Layout from '../../components/layout/Layout';

const projects = [
  { title: 'Brand Revamp — TechCo',    category: 'Branding',   year: '2024', color: '#7C3AED' },
  { title: 'E-Commerce Platform',       category: 'Web Dev',    year: '2024', color: '#2563EB' },
  { title: 'Creator Campaign',          category: 'Marketing',  year: '2023', color: '#D97706' },
  { title: 'Mobile App UI',             category: 'UI/UX',      year: '2023', color: '#059669' },
  { title: 'Product Launch Video',      category: 'Video',      year: '2024', color: '#DC2626' },
  { title: 'SaaS Dashboard',            category: 'Web Dev',    year: '2024', color: '#2563EB' },
];

export default function Portfolio() {
  return (
    <Layout>
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', bottom: '20%', left: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(88,84,156,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-up">
          <span className="badge">Our Work</span>
          <h1 className="section-title">Portfolio</h1>
          <p className="section-sub">A showcase of projects we're proud of.</p>
        </div>

        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {projects.map(({ title, category, year, color }, i) => (
            <div
              key={title}
              className="card animate-fade-up"
              style={{
                padding: '2rem',
                opacity: 0,
                animationDelay: `${i * 100}ms`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Color accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '3px',
                backgroundColor: color,
                opacity: 0.7,
              }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#58549C',
                  backgroundColor: 'rgba(88,84,156,0.12)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                }}>
                  {category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{year}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
                {title}
              </h3>

              <div style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: '#58549C',
                fontWeight: 600,
              }}>
                View Project
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
