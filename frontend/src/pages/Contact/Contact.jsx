import { useState } from 'react';
import { motion } from 'motion/react';
import { submitContact } from '../../api/api';
import { contactDetails } from '../../content/siteData';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

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
    <section className="page-shell">
      <div className="container contact-layout">
        <motion.div className="section-heading align-left" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Contact</p>
          <h1>Ready to turn your current frontend into something people remember?</h1>
          <p className="section-copy">
            Share your goals, references, launch timeline, and what feels broken today. We will shape the next version with you.
          </p>
          <div className="contact-list">
            {contactDetails.map((item) => (
              <div key={item.label} className="contact-item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form className="contact-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <div className="form-grid">
            <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          </div>
          <input name="subject" placeholder="Project type" value={form.subject} onChange={handleChange} required />
          <textarea name="message" rows={7} placeholder="Tell us what you want to build" value={form.message} onChange={handleChange} required />
          {status === 'success' && <p className="form-message success">Message sent successfully.</p>}
          {status === 'error' && <p className="form-message error">Something went wrong while sending your message.</p>}
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send enquiry'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
