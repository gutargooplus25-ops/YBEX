import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const ROLES = [
  { value: 'super-admin', label: 'Super Admin',  icon: '⚡', color: '#FF3D10', desc: 'Advanced admin privileges' },
  { value: 'sub-admin',   label: 'Sub Admin',    icon: '🔧', color: '#00D26A', desc: 'Limited admin access' },
  { value: 'user',        label: 'User',         icon: '👤', color: 'rgba(255,255,255,0.5)', desc: 'Standard user access' },
];
const ALL_ROLES = [
  { value: 'admin',       label: 'Owner Admin',  icon: '👑', color: '#E4F141', desc: 'Full system access & ownership' },
  ...ROLES,
];
const getRoleConf = (r) => ALL_ROLES.find(x => x.value === r) || ROLES[2];

/* ── Success Animation ── */
function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.8, repeat: 2 }}
          style={{ fontSize: '5rem', marginBottom: '1rem' }}
        >✨</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '1.8rem', fontWeight: 900, color: '#E4F141', marginBottom: '0.5rem' }}
        >User Updated!</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)' }}
        >Changes saved successfully</motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Premium Edit Modal ── */
function EditModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    if (!name.trim() || !email.trim()) {
      setErr('Name and email are required');
      return;
    }
    if (name === user.name && email === user.email && role === user.role) {
      onClose();
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const res = await axiosInstance.patch(`/admin/users/${user._id}`, { name: name.trim(), email: email.trim(), role });
      onSaved(res.data.user);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(onClose, 300);
      }, 2000);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to update user');
      setSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess && <SuccessAnimation onComplete={onClose} />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      >
        <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 40 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '420px', background: 'linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(228,241,65,0.08)' }}
      >
          {/* Header Glow */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #E4F141 30%, #FF3D10 70%, transparent)' }} />
          
          {/* Header */}
          <div style={{ padding: '1.1rem 1.4rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(228,241,65,0.15), rgba(255,61,16,0.15))', border: '1px solid rgba(228,241,65,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}
              >✏️</motion.div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Edit User</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>Update info & permissions</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.85 }}
              onClick={onClose} disabled={saving}
              style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            >✕</motion.button>
          </div>

          {/* Form */}
          <div style={{ padding: '1.25rem 1.4rem' }}>
            {/* Name Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Full Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#E4F141'; e.target.style.background = 'rgba(228,241,65,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#E4F141'; e.target.style.background = 'rgba(228,241,65,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>User Role</label>
              <div style={{ display: 'grid', gap: '0.45rem' }}>
                {ROLES.map(opt => {
                  const active = role === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ x: 4, boxShadow: active ? `0 6px 18px ${opt.color}28` : '0 3px 10px rgba(0,0,0,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole(opt.value)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.65rem 0.9rem', background: active ? `linear-gradient(135deg, ${opt.color}18, ${opt.color}08)` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${active ? opt.color + '55' : 'rgba(255,255,255,0.08)'}`, borderRadius: '11px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeRole"
                          style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${opt.color}10, transparent)`, pointerEvents: 'none' }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <span style={{ fontSize: '1.15rem', flexShrink: 0, position: 'relative', zIndex: 1 }}>{opt.icon}</span>
                      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: active ? opt.color : '#fff', marginBottom: '1px' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>{opt.desc}</div>
                      </div>
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{ width: '18px', height: '18px', borderRadius: '50%', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: '#000', fontWeight: 900, position: 'relative', zIndex: 1, boxShadow: `0 3px 10px ${opt.color}50`, flexShrink: 0 }}
                          >✓</motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ marginTop: '0.9rem', padding: '0.6rem 0.85rem', background: 'rgba(255,61,16,0.12)', border: '1px solid rgba(255,61,16,0.4)', borderRadius: '9px', color: '#FF6B4A', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <span style={{ fontSize: '1rem' }}>⚠️</span>
                  <span>{err}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: '0.9rem 1.4rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onClose} disabled={saving}
              style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >Cancel</motion.button>
            <motion.button
              whileHover={!saving ? { scale: 1.03, boxShadow: '0 6px 22px rgba(228,241,65,0.4)' } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
              onClick={save} disabled={saving}
              style={{ padding: '0.6rem 1.5rem', background: saving ? 'rgba(228,241,65,0.5)' : 'linear-gradient(135deg, #E4F141, #FFD700)', border: 'none', borderRadius: '10px', color: '#000', fontSize: '0.82rem', fontWeight: 900, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s', boxShadow: '0 3px 14px rgba(228,241,65,0.28)' }}
            >
              {saving ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }}
                  />
                  Saving...
                </>
              ) : <>✓ Save Changes</>}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ── Create Admin Modal ── */
const CREATE_ROLES = [
  { value: 'admin',       label: 'Owner Admin',  icon: '👑', color: '#E4F141', desc: 'Full system access & ownership' },
  { value: 'super-admin', label: 'Super Admin',  icon: '⚡', color: '#FF3D10', desc: 'Advanced admin privileges' },
  { value: 'sub-admin',   label: 'Sub Admin',    icon: '🔧', color: '#00D26A', desc: 'Limited admin access' },
];
const STATUS_OPTIONS = [
  { value: 'school', label: 'School', icon: '🎓' },
  { value: 'pitch',  label: 'Pitch',  icon: '📊' },
  { value: 'sales',  label: 'Sales',  icon: '💰' },
  { value: 'general',label: 'General',icon: '🌐' },
];

function CreateAdminModal({ onClose, onCreated }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [role,     setRole]     = useState('');
  const [roleOpen, setRoleOpen] = useState(false);
  const [status,   setStatus]   = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [err,      setErr]      = useState('');

  const toggleStatus = (val) =>
    setStatus(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);

  const selectedRole = CREATE_ROLES.find(r => r.value === role);

  const save = async () => {
    if (!name.trim())        { setErr('Name is required'); return; }
    if (!email.trim())       { setErr('Email is required'); return; }
    if (!password || password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (!role)               { setErr('Please select a role'); return; }
    setSaving(true); setErr('');
    try {
      const res = await axiosInstance.post('/admin/users', { name: name.trim(), email: email.trim(), password, role, status });
      onCreated(res.data.user);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setTimeout(onClose, 300); }, 2000);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to create admin');
      setSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} style={{ textAlign: 'center' }}>
              <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8, repeat: 2 }} style={{ fontSize: '4.5rem', marginBottom: '0.75rem' }}>🎉</motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: '1.6rem', fontWeight: 900, color: '#E4F141', marginBottom: '0.4rem' }}>Admin Created!</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)' }}>New admin account is ready</motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '440px', background: 'linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(0,210,106,0.08)' }}
        >
          {/* Top glow */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #00D26A 30%, #E4F141 70%, transparent)' }} />

          {/* Header */}
          <div style={{ padding: '1.1rem 1.4rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0,210,106,0.18), rgba(228,241,65,0.12))', border: '1px solid rgba(0,210,106,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}
              >➕</motion.div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Add New Admin</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>Owner admin only · Credentials sent to new admin</div>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.85 }}
              onClick={onClose} disabled={saving}
              style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            >✕</motion.button>
          </div>

          {/* Form */}
          <div style={{ padding: '1.25rem 1.4rem' }}>

            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.82rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#00D26A'; e.target.style.background = 'rgba(0,210,106,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ybex.studio"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.82rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#00D26A'; e.target.style.background = 'rgba(0,210,106,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  style={{ width: '100%', padding: '0.6rem 2.4rem 0.6rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.82rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#00D26A'; e.target.style.background = 'rgba(0,210,106,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button onClick={() => setShowPw(p => !p)} type="button"
                  style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', padding: 0, lineHeight: 1 }}
                >{showPw ? '🙈' : '👁'}</button>
              </div>
            </div>

            {/* Role — custom dropdown */}
            <div style={{ marginBottom: '0.85rem', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Role</label>
              <motion.button
                whileTap={{ scale: 0.99 }}
                onClick={() => setRoleOpen(o => !o)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${selectedRole ? selectedRole.color + '55' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', color: selectedRole ? selectedRole.color : 'rgba(255,255,255,0.35)', fontSize: '0.82rem', fontWeight: selectedRole ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  {selectedRole ? <>{selectedRole.icon} {selectedRole.label}</> : 'Select a role…'}
                </span>
                <motion.span animate={{ rotate: roleOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>▼</motion.span>
              </motion.button>

              <AnimatePresence>
                {roleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50, background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
                  >
                    {CREATE_ROLES.map((opt, idx) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ background: `${opt.color}12` }}
                        onClick={() => { setRole(opt.value); setRoleOpen(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.7rem 0.9rem', background: role === opt.value ? `${opt.color}15` : 'transparent', border: 'none', borderBottom: idx < CREATE_ROLES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                      >
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: role === opt.value ? opt.color : '#fff' }}>{opt.label}</div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.38)', marginTop: '1px' }}>{opt.desc}</div>
                        </div>
                        {role === opt.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ width: '16px', height: '16px', borderRadius: '50%', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', color: '#000', fontWeight: 900, flexShrink: 0 }}
                          >✓</motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status checkboxes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status <span style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(select all that apply)</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                {STATUS_OPTIONS.map(opt => {
                  const checked = status.includes(opt.value);
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => toggleStatus(opt.value)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.55rem 0.8rem', background: checked ? 'rgba(228,241,65,0.1)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${checked ? 'rgba(228,241,65,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '9px', cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left' }}
                    >
                      {/* custom checkbox */}
                      <div style={{ width: '15px', height: '15px', borderRadius: '4px', background: checked ? '#E4F141' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${checked ? '#E4F141' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                        {checked && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '0.55rem', color: '#000', fontWeight: 900, lineHeight: 1 }}>✓</motion.span>}
                      </div>
                      <span style={{ fontSize: '0.78rem' }}>{opt.icon}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: checked ? 700 : 500, color: checked ? '#E4F141' : 'rgba(255,255,255,0.7)' }}>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {err && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ marginTop: '0.85rem', padding: '0.55rem 0.85rem', background: 'rgba(255,61,16,0.12)', border: '1px solid rgba(255,61,16,0.4)', borderRadius: '9px', color: '#FF6B4A', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <span>⚠️</span><span>{err}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div style={{ padding: '0.9rem 1.4rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onClose} disabled={saving}
              style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >Cancel</motion.button>
            <motion.button
              whileHover={!saving ? { scale: 1.03, boxShadow: '0 6px 22px rgba(0,210,106,0.4)' } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
              onClick={save} disabled={saving}
              style={{ padding: '0.6rem 1.5rem', background: saving ? 'rgba(0,210,106,0.4)' : 'linear-gradient(135deg, #00D26A, #00FF88)', border: 'none', borderRadius: '10px', color: '#000', fontSize: '0.82rem', fontWeight: 900, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s', boxShadow: '0 3px 14px rgba(0,210,106,0.28)' }}
            >
              {saving ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }} />Creating…</>
              ) : <>✦ Create Admin</>}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const go = async () => { setDeleting(true); await onConfirm(user._id); setDeleting(false); onClose(); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '380px', background: '#0e0e0e', border: '1px solid rgba(255,61,16,0.25)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.9)' }}
      >
        <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#FF3D10,transparent)' }} />
        <div style={{ padding: '2rem 1.75rem', textAlign: 'center' }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</motion.div>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>Delete User?</div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Permanently delete <span style={{ color: '#fff', fontWeight: 700 }}>{user.name}</span>.<br />This cannot be undone.
          </div>
        </div>
        <div style={{ padding: '0.75rem 1.75rem 1.5rem', display: 'flex', gap: '0.65rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.72rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <motion.button whileHover={!deleting ? { scale: 1.03, boxShadow: '0 6px 20px rgba(255,61,16,0.4)' } : {}} whileTap={!deleting ? { scale: 0.97 } : {}}
            onClick={go} disabled={deleting}
            style={{ flex: 1, padding: '0.72rem', background: deleting ? 'rgba(255,61,16,0.4)' : '#FF3D10', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {deleting ? (<><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Deleting…</>) : '🗑 Delete'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const rowV = {
  hidden: { opacity: 0, x: -14 },
  show: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.38, ease: [0.22, 1, 0.36, 1] } }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.22 } },
};

export default function AdminUsers() {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [editTarget, setEditTarget]   = useState(null);
  const [delTarget, setDelTarget]     = useState(null);
  const [createOpen, setCreateOpen]   = useState(false);

  useEffect(() => {
    axiosInstance.get('/admin/users')
      .then(r => setUsers(r.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleSaved   = (updated) => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
  const handleCreated = (newUser) => setUsers(prev => [newUser, ...prev]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AnimatePresence>
        {createOpen  && <CreateAdminModal onClose={() => setCreateOpen(false)} onCreated={handleCreated} />}
        {editTarget  && <EditModal user={editTarget} onClose={() => setEditTarget(null)} onSaved={handleSaved} />}
        {delTarget   && <DeleteModal user={delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} />}
      </AnimatePresence>

      {/* header */}
      <div className="users-header" style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>Manage Admins</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>{users.length} registered users</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
            <input className="users-search-input" type="text" placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', width: '220px', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = '#E4F141'; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          {/* Add Admin button */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 6px 22px rgba(0,210,106,0.4)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0.6rem 1.1rem', background: 'linear-gradient(135deg, #00D26A, #00FF88)', border: 'none', borderRadius: '10px', color: '#000', fontSize: '0.82rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 3px 14px rgba(0,210,106,0.28)', whiteSpace: 'nowrap' }}
          >
            <span style={{ fontSize: '0.9rem' }}>✦</span> Add Admin
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              style={{ height: '58px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
          {/* table header */}
          <div className="ut-header" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 160px 110px', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', gap: '1rem' }}>
            <span>Name</span><span>Email</span><span>Role</span><span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '3.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👤</div>No users found.
              </motion.div>
            ) : filtered.map((user, i) => {
              const rc = getRoleConf(user.role);
              return (
                <motion.div key={user._id} custom={i} variants={rowV} initial="hidden" animate="show" exit="exit" layout
                  whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                  className="ut-row"
                  style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 160px 110px', padding: '1rem 1.5rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', gap: '1rem' }}
                >
                  {/* name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `${rc.color}18`, border: `1px solid ${rc.color}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: rc.color, flexShrink: 0 }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  </div>

                  {/* email */}
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>

                  {/* role */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, background: `${rc.color}15`, color: rc.color, border: `1px solid ${rc.color}35`, letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content' }}>
                    {rc.icon} {rc.label}
                  </span>

                  {/* actions */}
                  <div style={{ display: 'flex', gap: '0.55rem', justifyContent: 'flex-end' }}>
                    <motion.button
                      whileHover={{ scale: 1.12, background: 'rgba(228,241,65,0.18)', borderColor: 'rgba(228,241,65,0.6)' }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setEditTarget(user)} title="Edit user"
                      style={{ width: '34px', height: '34px', background: 'rgba(228,241,65,0.08)', border: '1px solid rgba(228,241,65,0.25)', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', transition: 'all 0.15s', flexShrink: 0 }}
                    >✏️</motion.button>
                    <motion.button
                      whileHover={{ scale: 1.12, background: 'rgba(255,61,16,0.28)', borderColor: 'rgba(255,61,16,0.5)' }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setDelTarget(user)} title="Delete user"
                      style={{ width: '34px', height: '34px', background: 'rgba(255,61,16,0.08)', border: '1px solid rgba(255,61,16,0.25)', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', transition: 'all 0.15s', flexShrink: 0 }}
                    >🗑</motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .users-search-input { width: 100% !important; }
          .ut-header { display: none !important; }
          .ut-row { grid-template-columns: 1fr !important; gap: 0.6rem !important; padding: 1rem !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .ut-header, .ut-row { grid-template-columns: 1fr 1.4fr 130px 90px !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
