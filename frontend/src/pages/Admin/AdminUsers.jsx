import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const ROLES = [
  { value: 'admin', label: 'Owner Admin',  icon: '👑', color: '#E4F141', desc: 'Full access to all features'    },
  { value: 'user',  label: 'User',         icon: '👤', color: 'rgba(255,255,255,0.5)', desc: 'Standard user access' },
];
const getRoleConf = (r) => ROLES.find(x => x.value === r) || ROLES[1];

/* ── Edit Modal ── */
function EditModal({ user, onClose, onSaved }) {
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    if (role === user.role) { onClose(); return; }
    setSaving(true); setErr('');
    try {
      const validRole = ['admin', 'user'].includes(role) ? role : 'user';
      const res = await axiosInstance.patch(`/admin/users/${user._id}/role`, { role: validRole });
      onSaved({ ...res.data.user, role });
      onClose();
    } catch (e) { setErr(e.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 28 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '460px', background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.9)' }}
      >
        <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#E4F141,transparent)' }} />
        <div style={{ padding: '1.5rem 1.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✏️</div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>Edit Admin</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{user.name} · {user.email}</div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</motion.button>
        </div>

        <div style={{ padding: '1.5rem 1.75rem' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>Select Role</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {ROLES.map(opt => {
              const active = role === opt.value;
              return (
                <motion.button key={opt.value} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(opt.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0.85rem 1.1rem', background: active ? `${opt.color}12` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? opt.color + '50' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                >
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: active ? opt.color : '#fff' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{opt.desc}</div>
                  </div>
                  <AnimatePresence>
                    {active && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        style={{ width: '18px', height: '18px', borderRadius: '50%', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#000', fontWeight: 900 }}
                      >✓</motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
          {err && <div style={{ marginTop: '0.9rem', padding: '0.6rem 0.9rem', background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '8px', color: '#FF3D10', fontSize: '0.78rem' }}>⚠ {err}</div>}
        </div>

        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <motion.button whileHover={!saving ? { scale: 1.03, boxShadow: '0 6px 20px rgba(228,241,65,0.3)' } : {}} whileTap={!saving ? { scale: 0.97 } : {}}
            onClick={save} disabled={saving}
            style={{ padding: '0.6rem 1.4rem', background: saving ? 'rgba(228,241,65,0.4)' : '#E4F141', border: 'none', borderRadius: '10px', color: '#000', fontSize: '0.82rem', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {saving ? (<><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }} />Saving…</>) : '✓ Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
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

  const handleSaved = (updated) => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AnimatePresence>
        {editTarget && <EditModal user={editTarget} onClose={() => setEditTarget(null)} onSaved={handleSaved} />}
        {delTarget  && <DeleteModal user={delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} />}
      </AnimatePresence>

      {/* header */}
      <div className="users-header" style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>Manage Admins</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>{users.length} registered users</p>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
          <input className="users-search-input" type="text" placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', width: '100%', transition: 'border-color 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#E4F141'; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
          />
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
          {/* table header — no Joined column */}
          <div className="ut-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 130px 80px', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
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
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 130px 80px', padding: '0.95rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}
                >
                  {/* name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${rc.color}18`, border: `1px solid ${rc.color}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: rc.color, flexShrink: 0 }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  </div>

                  {/* email */}
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>

                  {/* role */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, background: `${rc.color}15`, color: rc.color, border: `1px solid ${rc.color}35`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {rc.icon} {rc.label}
                  </span>

                  {/* actions */}
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <motion.button whileHover={{ scale: 1.12, background: 'rgba(228,241,65,0.15)', borderColor: 'rgba(228,241,65,0.5)' }} whileTap={{ scale: 0.9 }}
                      onClick={() => setEditTarget(user)} title="Edit role"
                      style={{ width: '30px', height: '30px', background: 'rgba(228,241,65,0.07)', border: '1px solid rgba(228,241,65,0.2)', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', transition: 'all 0.15s' }}
                    >✏️</motion.button>
                    <motion.button whileHover={{ scale: 1.12, background: 'rgba(255,61,16,0.25)' }} whileTap={{ scale: 0.9 }}
                      onClick={() => setDelTarget(user)} title="Delete"
                      style={{ width: '30px', height: '30px', background: 'rgba(255,61,16,0.08)', border: '1px solid rgba(255,61,16,0.2)', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem' }}
                    >🗑</motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .users-search-input { width: 100% !important; } .ut-header { display: none !important; } .ut-row { grid-template-columns: 1fr !important; gap: 0.5rem !important; padding: 1rem !important; } }
        @media (min-width: 641px) and (max-width: 900px) { .ut-header, .ut-row { grid-template-columns: 1fr 1.3fr 100px 70px !important; } }
      `}</style>
    </AdminLayout>
  );
}
