// src/pages/home/HeroSection.jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const videoRef = useRef(null);

  // Ensure video exists (fallback if missing)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.opacity = '0.3';
    }
  }, []);

  return (
    <section className="hero-section">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="hero-video"
      >
        <source src="/video.mp4" type="video/mp4" />
        {/* Fallback for no video */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
        }} />
      </video>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span>🚀</span>
          Welcome to YBEX
        </div>
        
        <h1 className="hero-title">
          Build. <span style={{ color: '#58549C' }}>Scale.</span> Succeed.
        </h1>
        
        <p className="hero-subtitle">
          YBEX empowers businesses and creators with cutting-edge influencer marketing, 
          data-driven strategies, and premium brand experiences.
        </p>
        
        <div className="hero-buttons">
          <Link to="/get-started" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/services" className="btn btn-outline">
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}