// src/pages/home/Home.jsx
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🎯', title: 'Influencer Marketing', desc: 'Connect with top creators who authentically amplify your brand.' },
  { icon: '📊', title: 'Data-Driven Strategy', desc: 'Leverage analytics to maximize ROI and measure real impact.' },
  { icon: '✨', title: 'Premium Branding', desc: 'Craft a distinctive brand identity that stands out.' },
  { icon: '🚀', title: 'Growth Acceleration', desc: 'Scale your reach with proven strategies for sustainable growth.' },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.5rem',
              background: 'rgba(88, 84, 156, 0.12)',
              border: '1px solid rgba(88, 84, 156, 0.35)',
              borderRadius: '50px',
              fontSize: '0.85rem',
              color: '#b8b4e0',
              marginBottom: '1.5rem',
            }}>
              <span>⚡</span>
              What We Do
            </div>
            
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fff 0%, #d0d0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Everything you need to grow
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.65)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              From influencer partnerships to data-driven strategy — we've got you covered end to end.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map((feature, i) => (
              <div 
                key={feature.title} 
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(88, 84, 156, 0.2)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(88, 84, 156, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(88, 84, 156, 0.2)';
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, rgba(88, 84, 156, 0.2) 0%, rgba(88, 84, 156, 0.1) 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                }}>
                  {feature.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.6,
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ backgroundColor: 'rgba(88, 84, 156, 0.02)' }}>
        <div className="container">
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '3rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(88, 84, 156, 0.2)',
            borderRadius: '20px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #fff 0%, #d0d0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Ready to build something extraordinary?
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '2rem',
            }}>
              Join hundreds of brands who trust YBEX to amplify their vision with data-driven influencer marketing.
            </p>
            
            <Link 
              to="/get-started" 
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #58549C, #6a67b8)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 600,
                boxShadow: '0 8px 30px rgba(88, 84, 156, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}