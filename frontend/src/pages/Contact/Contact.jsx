import { useState } from 'react';
import { motion } from 'motion/react';
import { submitContact } from '../../api/api';
import {
  contactCompanyTypes,
  contactDetails,
  contactPlatformOptions,
} from '../../content/siteData';

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    platform: '',
    companyType: '',
    platformLink: '',
    message: '',
  });
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
      await submitContact({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        subject: `${form.platform || 'Platform'} - ${form.companyType || 'General'}`,
        category: form.companyType || 'general',
        message: `Platform: ${form.platform || 'Not provided'}\nPlatform Link: ${
          form.platformLink || 'Not provided'
        }\n\n${form.message}`,
      });
      setStatus('success');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        platform: '',
        companyType: '',
        platformLink: '',
        message: '',
      });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="container">
        <motion.div
          className="contact-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="clone-pill">
            <span>24/7 Collaborate With Us</span>
          </div>
          <h1>
            Have Any Doubts? We
            <br />
            <span>are Ready to Help.</span>
          </h1>
          <p className="section-copy">
            Whether you need guidance, campaign support, creator collaboration, or a
            fresh start, our team is ready to assist you.
          </p>
        </motion.div>

        <div className="contact-layout contact-layout-premium">
          <motion.div
            className="contact-sidebar"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact-list">
              {contactDetails.map((item) => (
                <div key={item.label} className="contact-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            className="contact-form contact-form-premium"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="form-grid">
              <label className="contact-field">
                <span>First name*</span>
                <input
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="contact-field">
                <span>Last Name*</span>
                <input
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="contact-field contact-field-full">
              <span>How can we reach you?*</span>
              <input
                name="email"
                type="email"
                placeholder="your-mail@yourdomain.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-grid">
              <label className="contact-field">
                <span>Which Platform Best Describes You?</span>
                <select name="platform" value={form.platform} onChange={handleChange} required>
                  <option value="">Select your Platform ..</option>
                  {contactPlatformOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="contact-field">
                <span>What&apos;s the type of your company?*</span>
                <select
                  name="companyType"
                  value={form.companyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {contactCompanyTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="contact-field contact-field-full">
              <span>Platform Link</span>
              <input
                name="platformLink"
                placeholder="Youtube.com/@handle , Instagram.com/handle"
                value={form.platformLink}
                onChange={handleChange}
              />
            </label>

            <label className="contact-field contact-field-full">
              <span>Message*</span>
              <textarea
                name="message"
                rows={7}
                placeholder="Type your message..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            {status === 'success' && <p className="form-message success">Message sent successfully.</p>}
            {status === 'error' && <p className="form-message error">Something went wrong while sending your message.</p>}
            <button type="submit" className="button button-primary contact-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Fill The Form Out!'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
