import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { submitContact } from '../../api/api';
import { contactDetails } from '../../content/siteData';

// --- Theme Configuration ---
const THEME_ACCENT = '#7D4CF6';
const ERROR_ACCENT = '#FF453A';

// --- Validation Helpers ---
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isValidPhone = (v) => !v.trim() || /^[+]?[\d\s\-().]{7,15}$/.test(v.trim());

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

function Field({ name, type = 'text', placeholder, value, error, onChange, required = true, rows }) {
  const hasErr = !!error;
  const isTextarea = type === 'textarea';
  const InputTag = isTextarea ? 'textarea' : 'input';

  return (
    <div className="input-group">
      <InputTag
        name={name}
        type={isTextarea ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`classic-input ${hasErr ? 'has-error' : ''}`}
      />
      <AnimatePresence>
        {hasErr && (
          <motion.span 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="error-text"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validateAll = () => {
    const fields = ['name', 'email', 'subject', 'message'];
    const newErrors = {};
    let valid = true;
    fields.forEach(f => {
      let msg = '';
      if (f === 'email' && !isValidEmail(form[f])) { msg = 'Valid email required'; valid = false; }
      else if (f !== 'email' && !form[f].trim()) { msg = 'This field is required'; valid = false; }
      if (msg) newErrors[f] = msg;
    });
    if (form.phone && !isValidPhone(form.phone)) { newErrors.phone = 'Valid phone required'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true); setStatus(null);
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      setStatus('error');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <section ref={ref} className="page-shell classic-contact">
      
      {/* Soft Ambient Background Glow */}
      <div className="ambient-glow" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="contact-grid">
          
          {/* ══ LEFT: Typography & Info ══ */}
          <motion.div 
            className="contact-info-col"
            variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            <div className="text-content">
              <span className="eyebrow" style={{ color: THEME_ACCENT }}>Start a Project</span>
              <h1 className="classic-heading">Let's build something people remember.</h1>
              <p className="classic-desc">
                Share your goals, launch timeline, and what feels broken today. We will shape the next version with you.
              </p>
            </div>

            <div className="info-cards">
              <div className="info-item">
                <span className="info-label">Email Us</span>
                <a href="mailto:hello@ybexmedia.com" className="info-value">hello@ybexmedia.com</a>
              </div>
              <div className="info-item">
                <span className="info-label">Call Us</span>
                <a href="tel:+919876543210" className="info-value">+91 98765 43210</a>
              </div>
              <div className="info-item">
                <span className="info-label">Visit Us</span>
                <span className="info-value">Sector 63, Noida — Hyperfocus Building</span>
              </div>
            </div>
          </motion.div>

          {/* ══ RIGHT: Refined Form ══ */}
          <motion.div 
            className="contact-form-col"
            variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <div className="form-card">
              <div className="form-header">
                <h3>Send an Enquiry</h3>
                <p>Fill in the details and our team will get back to you.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <Field name="name" placeholder="Your name" value={form.name} error={errors.name} onChange={handleChange} />
                  <Field name="email" type="email" placeholder="Email address" value={form.email} error={errors.email} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <Field name="phone" type="tel" placeholder="Phone (optional)" value={form.phone} error={errors.phone} onChange={handleChange} required={false} />
                  <Field name="subject" placeholder="Project type" value={form.subject} error={errors.subject} onChange={handleChange} />
                </div>
                
                <Field name="message" type="textarea" rows={5} placeholder="Tell us what you want to build..." value={form.message} error={errors.message} onChange={handleChange} />

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="status-msg success">
                      Message sent successfully. We'll be in touch soon.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="status-msg error">
                      Something went wrong. Please try again later.
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ══ BOTTOM: Google Maps API Section ══ */}
        {/* ══ BOTTOM: Map Section (Using Original URLs) ══ */}
        <motion.div 
          className="map-section"
          variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.4 }}
        >
          <div className="map-header">
            <div>
              <span className="eyebrow" style={{ color: THEME_ACCENT, marginBottom: '0.5rem' }}>Our Headquarters</span>
              <h3>Drop by for a coffee.</h3>
            </div>
            {/* Using your original Google Maps redirect link */}
            <a 
              href="https://maps.google.com/?q=Hyperfocus+Building+Sector+63+Noida" 
              target="_blank" 
              rel="noreferrer"
              className="map-link-btn"
            >
              Open in Google Maps ↗
            </a>
          </div>

          <div className="map-container">
            {/* Using your original OpenStreetMap embed link */}
            <iframe
              title="YBEX Studio Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.3600%2C28.6150%2C77.3900%2C28.6350&layer=mapnik&marker=28.6250%2C77.3750"
              className="google-map-iframe"
            />
            
            {/* Premium Overlay badge */}
            <div className="map-badge">
              <div className="pulse-dot" />
              <div>
                <strong>YBEX Studio</strong>
                <span>D-216 Hyperfocus Building, Sector 63</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Embedded Classic Styles --- */}
      <style>{`
        .classic-contact {
          position: relative;
          padding: 100px 0;
          background-color: #050505; /* Deep, rich black */
          color: #ffffff;
          overflow: hidden;
        }

        .ambient-glow {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 60%;
          height: 80%;
          background: radial-gradient(circle, rgba(125, 76, 246, 0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* Typography */
        .eyebrow {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
          display: block;
        }

        .classic-heading {
          font-size: clamp(2.5rem, 4vw, 4rem);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem 0;
        }

        .classic-desc {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #999999;
          max-width: 90%;
          margin: 0 0 3rem 0;
        }

        /* Info Layout */
        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.75rem;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .info-value {
          font-size: 1.1rem;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .info-value[href]:hover {
          color: ${THEME_ACCENT};
        }

        /* Form Styling */
        .form-card {
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .form-header {
          margin-bottom: 2.5rem;
        }

        .form-header h3 {
          font-size: 1.5rem;
          font-weight: 500;
          margin: 0 0 0.5rem 0;
        }

        .form-header p {
          color: #888888;
          font-size: 0.95rem;
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }

        .form-row .input-group {
          margin-bottom: 0;
        }

        .classic-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }

        .classic-input::placeholder {
          color: #555555;
        }

        .classic-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: ${THEME_ACCENT};
        }

        .classic-input.has-error {
          border-color: ${ERROR_ACCENT};
          background: rgba(255, 69, 58, 0.05);
        }

        textarea.classic-input {
          resize: vertical;
          min-height: 120px;
        }

        .error-text {
          color: ${ERROR_ACCENT};
          font-size: 0.8rem;
          margin-top: 0.5rem;
          padding-left: 0.25rem;
        }

        /* Button */
        .submit-btn {
          width: 100%;
          background: ${THEME_ACCENT};
          color: #ffffff;
          border: none;
          padding: 1.1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #6a3fe0;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Status Msgs */
        .status-msg {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .status-msg.success { background: rgba(125, 76, 246, 0.1); border: 1px solid rgba(125, 76, 246, 0.3); color: #e2d4ff; }
        .status-msg.error { background: rgba(255, 69, 58, 0.1); border: 1px solid rgba(255, 69, 58, 0.3); color: #ffb3b0; }

        /* Map Section */
        .map-section {
          margin-top: 100px;
          padding-top: 80px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .map-header h3 {
          font-size: 2rem;
          font-weight: 500;
          margin: 0;
        }

        .map-link-btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .map-link-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .map-container {
          position: relative;
          width: 100%;
          height: 450px;
          border-radius: 24px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* 
          This filter makes the standard Google Map look like a custom "Dark Mode" map.
          It inverts the colors, adjusts the hue back to normal, and drops the brightness.
        */
        .google-map-iframe {
          filter: invert(90%) hue-rotate(180deg) brightness(85%) contrast(85%) grayscale(20%);
          transition: filter 0.5s ease;
        }
        
        .map-container:hover .google-map-iframe {
          filter: invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(10%);
        }

        .map-badge {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          pointer-events: none;
        }

        .map-badge strong {
          display: block;
          font-size: 0.95rem;
          color: #fff;
          margin-bottom: 0.2rem;
        }

        .map-badge span {
          display: block;
          font-size: 0.8rem;
          color: #888;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          background: ${THEME_ACCENT};
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(125, 76, 246, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(125, 76, 246, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(125, 76, 246, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(125, 76, 246, 0); }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr; gap: 60px; }
          .form-card { padding: 2rem; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; gap: 1.5rem; }
          .classic-heading { font-size: 2.2rem; }
          .map-container { height: 350px; }
          .map-badge { bottom: 1rem; left: 1rem; right: 1rem; }
        }
      `}</style>
    </section>
  );
}