import Layout from '../../components/layout/Layout';

const team = [
  { name: 'Alex Rivera',  role: 'Founder & CEO',      initial: 'A' },
  { name: 'Sara Khan',    role: 'Creative Director',   initial: 'S' },
  { name: 'James Lee',    role: 'Lead Developer',      initial: 'J' },
  { name: 'Priya Sharma', role: 'Marketing Head',      initial: 'P' },
];

const values = [
  { title: 'Mission',  desc: 'Empower every creator and brand to reach their full potential through strategy, design, and technology.' },
  { title: 'Vision',   desc: 'A world where great ideas get the platform they deserve — regardless of budget or background.' },
  { title: 'Values',   desc: 'Integrity, creativity, and relentless execution. We treat every project like it\'s our own.' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(88,84,156,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }} className="animate-fade-up">
          <span className="badge">Who We Are</span>
          <h1 className="section-title">About YBEX</h1>
          <p className="section-sub">
            We are a team of passionate builders, designers, and strategists on a mission to help brands and creators grow with purpose.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '5rem',
        }}>
          {values.map(({ title, desc }, i) => (
            <div
              key={title}
              className="card animate-fade-up"
              style={{ padding: '2rem', opacity: 0, animationDelay: `${i * 100}ms` }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#58549C', marginBottom: '0.75rem' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>Meet the Team</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
        }}>
          {team.map(({ name, role, initial }, i) => (
            <div
              key={name}
              className="card animate-fade-up"
              style={{ padding: '2rem', textAlign: 'center', opacity: 0, animationDelay: `${i * 100}ms` }}
            >
              <div style={{
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #58549C, rgba(88,84,156,0.4))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 800, color: '#ffffff',
                margin: '0 auto 1rem',
                boxShadow: '0 0 20px rgba(88,84,156,0.3)',
              }}>
                {initial}
              </div>
              <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{name}</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>{role}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
