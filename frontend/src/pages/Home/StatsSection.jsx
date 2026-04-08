const stats = [
  { value: '200+', label: 'Projects Delivered' },
  { value: '150+', label: 'Happy Clients' },
  { value: '50+',  label: 'Team Members' },
  { value: '8+',   label: 'Years Experience' },
];

export default function StatsSection() {
  return (
    <section style={{ padding: '5rem 1.5rem' }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.5rem',
      }}>
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            className="card animate-fade-up"
            style={{
              padding: '2rem',
              textAlign: 'center',
              animationDelay: `${i * 100}ms`,
              opacity: 0,
            }}
          >
            <p style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#58549C',
              lineHeight: 1,
              marginBottom: '0.5rem',
              textShadow: '0 0 30px rgba(88,84,156,0.4)',
            }}>
              {value}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
