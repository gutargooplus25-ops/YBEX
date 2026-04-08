import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

const courses = [
  { title: 'Brand Building 101',       level: 'Beginner',     duration: '4 weeks', icon: '🎨', students: '1.2k' },
  { title: 'Content Creation Mastery', level: 'Intermediate', duration: '6 weeks', icon: '📸', students: '890' },
  { title: 'Social Media Growth',      level: 'Beginner',     duration: '3 weeks', icon: '📱', students: '2.1k' },
  { title: 'Video Storytelling',       level: 'Advanced',     duration: '8 weeks', icon: '🎬', students: '640' },
];

const levelColor = { Beginner: '#059669', Intermediate: '#D97706', Advanced: '#DC2626' };

export default function Academy() {
  return (
    <Layout>
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '15%', right: '-80px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(88,84,156,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-up">
          <span className="badge">Learn & Grow</span>
          <h1 className="section-title">YBEX Academy</h1>
          <p className="section-sub">
            Level up your skills with expert-led courses built for creators and entrepreneurs.
          </p>
        </div>

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
        }}>
          {courses.map(({ title, level, duration, icon, students }, i) => (
            <div
              key={title}
              className="card animate-fade-up"
              style={{ padding: '2rem', opacity: 0, animationDelay: `${i * 100}ms` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '52px', height: '52px',
                  backgroundColor: 'rgba(88,84,156,0.18)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      color: levelColor[level],
                      backgroundColor: `${levelColor[level]}18`,
                      padding: '0.15rem 0.6rem',
                      borderRadius: '9999px',
                    }}>
                      {level}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                      {duration}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(88,84,156,0.15)',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  👥 {students} enrolled
                </span>
                <Link
                  to="/get-started"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#58549C',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#58549C'}
                >
                  Enroll Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
