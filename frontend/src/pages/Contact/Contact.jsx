import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { submitContact } from '../../api/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '-80px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(88,84,156,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-up">
            <span className="badge">Get In Touch</span>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-sub">Have a project in mind? We'd love to hear from you.</p>
          </div>

          <div className="card animate-fade-up" style={{ padding: '2.5rem', opacity: 0, animationDelay: '100ms' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="input-field"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                className="input-field"
                style={{ resize: 'none' }}
              />

              {status === 'success' && (
                <p style={{ color: '#4ade80', fontSize: '0.875rem', textAlign: 'center' }}>
                  ✓ Message sent successfully!
                </p>
              )}
              {status === 'error' && (
                <p style={{ color: '#f87171', fontSize: '0.875rem', textAlign: 'center' }}>
                  ✗ Failed to send. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ padding: '0.875rem', justifyContent: 'center', fontSize: '0.95rem', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
