import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { loginUser } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, user } = res.data;
      if (user.role !== 'admin') {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      login(token, user);
      navigate('/admin/enquiries');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse, #ff4500 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'fixed', bottom: '5%', right: '10%',
          width: '400px', height: '300px',
          background: 'radial-gradient(ellipse, #ff6b35 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
            x: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          style={{
            position: 'fixed',
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: '4px', height: '4px',
            background: '#ff4500',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '440px', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}
          >
            <motion.div
              animate={{ boxShadow: ['0 0 0px #ff4500', '0 0 20px #ff450066', '0 0 0px #ff4500'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: '44px', height: '44px', background: '#ff4500',
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '1rem', color: '#fff',
              }}
            >YB</motion.div>
            <div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                YBEX <span style={{ color: '#ff4500' }}>ADMIN</span>
              </div>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            Secure Dashboard Management
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '2.5rem',
            backdropFilter: 'blur(20px)',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}
          >
            Sign in to Command Center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginBottom: '2rem' }}
          >
            Owner admin credentials required
          </motion.p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.35)',
                  borderRadius: '10px', padding: '0.75rem 1rem',
                  color: '#ff6b35', fontSize: '0.85rem', marginBottom: '1.5rem',
                  overflow: 'hidden',
                }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <label style={{
                display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem',
                fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Email</label>
              <motion.input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
                animate={{ borderColor: focused === 'email' ? '#ff4500' : 'rgba(255,255,255,0.1)' }}
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: '#fff', fontSize: '0.9rem',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(255,69,0,0.12)' : 'none',
                }}
              />
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42 }}
              style={{ marginBottom: '2rem' }}
            >
              <label style={{
                display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem',
                fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Password</label>
              <motion.input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${focused === 'password' ? '#ff4500' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '10px', color: '#fff', fontSize: '0.9rem',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: focused === 'password' ? '0 0 0 3px rgba(255,69,0,0.12)' : 'none',
                }}
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(255,69,0,0.4)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? 'rgba(255,69,0,0.4)' : '#ff4500',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontSize: '0.95rem', fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                  />
                  Signing in...
                </span>
              ) : 'Access Dashboard →'}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}
        >
          YBEX Command Center · Restricted Access
        </motion.p>
      </motion.div>
    </div>
  );
}
