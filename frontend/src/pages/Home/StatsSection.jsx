// src/pages/home/StatsSection.jsx
import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 200, suffix: '+', label: 'Projects Delivered' },
  { value: 150, suffix: '+', label: 'Happy Clients' },
  { value: 50, suffix: '+', label: 'Team Members' },
  { value: 8, suffix: '+', label: 'Years Experience' },
];

function AnimatedCounter({ end, suffix }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    let animationFrame;

    const animate = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="stats-section section">
      <div className="container">
        <div className="stats-grid">
        
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-value">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}