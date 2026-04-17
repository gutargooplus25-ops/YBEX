import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const STATUS_COLORS = {
  pending:  { bg: 'rgba(250,204,21,0.12)', color: '#facc15', border: 'rgba(250,204,21,0.3)' },
  accepted: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  rejected: { bg: 'rgba(255,61,16,0.12)',  color: '#FF3D10', border: 'rgba(255,61,16,0.3)'  },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

export default function AdminHiring() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchApplications = async (status) => {
    setLoading(true);
    try {
      const params = status !== 'all' ? `?status=${status}` : '';
      const res = await axiosInstance.get(`/admin/hiring${params}`);
      setApplications(res.data.applications || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications('all'); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/admin/hiring/${id}`, { status: newStatus });
      setApplications((prev) => prev.map((a) => a._id === id ? res.data.application : a));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await axiosInstance.delete(`/admin/hiring/${id}`);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleFilter = (s) => { setFilter(s); fetchApplications(s); };

  return (
    <AdminLayout>
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(96,165,250,0.08))',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: '16px', padding: '1.5rem 2rem',
          marginBottom: '1.75rem', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.3rem' }}>💼</span>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>Team YBEX Applications</h1>
          <span style={{ marginLeft: 'auto', fontSize: '1.5rem', opacity: 0.4 }}>🚀</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Talent Pipeline Management</p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
      >
        {['all', 'pending', 'accepted', 'rejected'].map((s, i) => {
          const isActive = filter === s;
          const sc = s !== 'all' ? STATUS_COLORS[s] : null;
          return (
            <button key={s} onClick={() => handleFilter(s)}
              style={{
                padding: '0.4rem 1.1rem',
                background: isActive ? (sc ? sc.bg : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? (sc ? sc.border : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px',
                color: isActive ? (sc ? sc.color : '#fff') : 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize', letterSpacing: '0.05em',
                transition: 'all 0.15s ease',
              }}
            >{s}</button>
          );
        })}
      </motion.div>

      {/* Applications list */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                style={{ height: '120px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </motion.div>
        ) : applications.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💼</div>
            No applications found.
          </motion.div>
        ) : (
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <AnimatePresence>
              {applications.map((app, i) => {
                const st = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
                return (
                  <motion.div
                    key={app._id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    whileHover={{ borderColor: 'rgba(255,255,255,0.14)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
                    style={{
                      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px', padding: '1.25rem 1.5rem',
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {app.position && (
                        <span style={{
                          background: 'rgba(167,139,250,0.15)', color: '#a78bfa',
                          fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.65rem',
                          borderRadius: '20px', border: '1px solid rgba(167,139,250,0.3)',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>{app.position}</span>
                      )}
                      <span style={{
                        background: st.bg, color: st.color,
                        fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.65rem',
                        borderRadius: '20px', border: `1px solid ${st.border}`,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>{app.status}</span>
                      <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.72rem', marginLeft: 'auto' }}>{formatDate(app.createdAt)}</span>
                    </div>

                    {/* Name */}
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>{app.name}</div>

                    {/* Contact */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
                        <span style={{ color: '#e4f141' }}>✉</span> {app.email}
                      </span>
                      {app.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
                          <span style={{ color: '#e4f141' }}>📞</span> {app.phone}
                        </span>
                      )}
                      {app.resumeLink && (
                        <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e4f141', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                          🔗 RESUME
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['pending', 'accepted', 'rejected'].map((s) => (
                        <button key={s} onClick={() => handleStatusChange(app._id, s)}
                          style={{
                            padding: '0.32rem 0.85rem',
                            background: app.status === s ? STATUS_COLORS[s].bg : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${app.status === s ? STATUS_COLORS[s].border : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '6px',
                            color: app.status === s ? STATUS_COLORS[s].color : 'rgba(255,255,255,0.4)',
                            fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
                            textTransform: 'capitalize', letterSpacing: '0.05em',
                            transition: 'all 0.15s ease',
                          }}
                        >{s}</button>
                      ))}
                      <button onClick={() => handleDelete(app._id)}
                        style={{
                          padding: '0.32rem 0.85rem', marginLeft: 'auto',
                          background: 'rgba(255,61,16,0.08)', border: '1px solid rgba(255,61,16,0.2)',
                          borderRadius: '6px', color: '#FF3D10',
                          fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
                        }}
                      >Delete</button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
