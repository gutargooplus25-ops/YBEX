import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

const services = [
  { icon: '🎨', title: 'Brand Identity',     desc: 'Logo, color palette, typography, and full brand guidelines that make you unforgettable.' },
  { icon: '💻', title: 'Web Development',    desc: 'Fast, responsive, and scalable websites and web apps built with modern tech.' },
  { icon: '📈', title: 'Digital Marketing',  desc: 'SEO, paid ads, social media, and content strategy that drives real results.' },
  { icon: '🎬', title: 'Video Production',   desc: 'High-quality video content for brands, creators, and product launches.' },
  { icon: '✏️', title: 'UI/UX Design',       desc: 'User-centered design that converts visitors into loyal customers.' },
  { icon: '🧠', title: 'Strategy & Consulting', desc: 'Expert guidance to help you make smarter business decisions faster.' },
];

export default function Services() {
  return (
    <Layout>
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(88,84,156,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-up">
          <span className="badge">What We Do</span>
          <h1 className="section-title">Services</h1>
          <p className="section-sub">End-to-end solutions to build, launch, and grow your brand.</p>
        </div>

        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {services.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="card animate-fade-up"
              style={{ padding: '2rem', opacity: 0, animationDelay: `${i * 100}ms` }}
            >
              <div style={{
                width: '52px', height: '52px',
                backgroundColor: 'rgba(88,84,156,0.18)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.25rem',
              }}>
                {icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link to="/contact" className="btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
            Discuss Your Project
          </Link>
        </div>
      </section>
    </Layout>
  );
}
