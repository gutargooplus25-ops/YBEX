import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import useAuth from '../../hooks/useAuth';
import { loginUser, registerUser } from '../../api/api';

export default function GetStarted() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      login(response.data.token, response.data.user);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to continue right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell auth-shell">
      <div className="container auth-layout">
        <motion.div className="section-heading align-left" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Start a project</p>
          <h1>Open the door to a more premium YBEX experience.</h1>
          <p className="section-copy">
            Sign in or create an account to move into enquiry, collaboration, and future admin-ready workflows.
          </p>
        </motion.div>

        <motion.div className="auth-card" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <div className="auth-toggle">
            <button type="button" className={!isLogin ? 'is-active' : ''} onClick={() => setIsLogin(false)}>Create account</button>
            <button type="button" className={isLogin ? 'is-active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            )}
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            {error && <p className="form-message error">{error}</p>}
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
