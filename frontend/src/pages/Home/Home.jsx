import Layout from '../../components/layout/Layout';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🎨', title: 'Brand Identity', desc: 'We craft brands that stand out and tell your story with clarity.' },
  { icon: '💻', title: 'Web & App Dev', desc: 'Fast, scalable, and beautiful digital products built to convert.' },
  { icon: '📈', title: 'Growth Strategy', desc: 'Data-driven marketing and strategy to accelerate your growth.' },
  { icon: '🎓', title: 'Creator Academy', desc: 'Learn from experts and build skills that matter in today\'s world.' },
];

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />

      {/* Features */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'rgba(88,84,156,0.04)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge">What We Do</span>
            <h2 className="section-title">Everything you need to grow</h2>
            <p className="section-sub">From brand identity to digital growth — we've got you covered end to end.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="card animate-fade-up"
                style={{ padding: '2rem', opacity: 0, animationDelay: `${i * 100}ms` }}
              >
                <div style={{
                  width: '52px', height: '52px',
                  backgroundColor: 'rgba(88,84,156,0.2)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1.25rem',
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, rgba(88,84,156,0.2) 0%, rgba(88,84,156,0.05) 100%)',
          border: '1px solid rgba(88,84,156,0.3)',
          borderRadius: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(88,84,156,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to build something great?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Join hundreds of brands and creators who trust YBEX to grow their vision.
          </p>
          <Link to="/get-started" className="btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
            Start Today
          </Link>
        </div>
      </section>
    </Layout>
  );
}
