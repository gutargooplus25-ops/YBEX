import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow blobs */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '700px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(88,84,156,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%', left: '10%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(88,84,156,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px', margin: '0 auto' }}
        className="animate-fade-up">
        <span className="badge">Welcome to YBEX</span>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
        }}>
          Build.{' '}
          <span style={{
            color: '#58549C',
            textShadow: '0 0 40px rgba(88,84,156,0.5)',
          }}>Scale.</span>
          {' '}Succeed.
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '2.5rem',
          maxWidth: '520px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          YBEX empowers businesses and creators with cutting-edge digital solutions, branding, and growth strategies.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/get-started" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Get Started
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link to="/services" className="btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}
