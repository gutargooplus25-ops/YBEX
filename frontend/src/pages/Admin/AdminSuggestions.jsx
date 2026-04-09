import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const STATUS_COLORS = {
  pending: { bg: 'rgba(250,204,21,0.1)', color: '#facc15', border: 'rgba(250,204,21,0.3)' },
  reviewed: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  implemented: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  rejected: { bg: 'rgba(255,69,0,0.1)', color: '#ff4500', border: 'rgba(255,69,0,0.3)' },
};

const STATUS_OPTIONS = ['pending', 'reviewed', 'implemented', 'rejected'];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchSuggestions = async (status) => {
    setLoading(true);
    try {
      const params = status !== 'all' ? `?status=${status}` : '';
      const res = await axiosInstance.get(`/admin/suggestions${params}`);
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions('all');
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/admin/suggestions/${id}`, { status: newStatus });
      setSuggestions((prev) => prev.map((s) => s._id === id ? res.data.suggestion : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this suggestion?')) return;
    try {
      await axiosInstance.delete(`/admin/suggestions/${id}`);
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchSuggestions(status);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
          Suggestions
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
          {suggestions.length} total suggestions
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}
      >
        {['all', ...STATUS_OPTIONS].map((s, i) => {
          const isActive = filterStatus === s;
          const sc = s !== 'all' ? STATUS_COLORS[s] : null;
          return (
            <motion.button
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange(s)}
              style={{
                padding: '0.4rem 1.1rem',
                background: isActive ? (sc ? sc.bg : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? (sc ? sc.border : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px',
                color: isActive ? (sc ? sc.color : '#fff') : 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize', letterSpacing: '0.05em',
                boxShadow: isActive && sc ? `0 4px 15px ${sc.color}22` : 'none',
              }}
            >
              {s}
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  height: '120px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            ))}
          </motion.div>
        ) : suggestions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', padding: '5rem', textAlign: 'center',
              color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem',
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
            >💭</motion.div>
            No suggestions found.
          </motion.div>
        ) : (
          <motion.div
            key={filterStatus}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <AnimatePresence>
              {suggestions.map((s, i) => {
                const statusStyle = STATUS_COLORS[s.status] || STATUS_COLORS.pending;
                return (
                  <motion.div
                    key={s._id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    whileHover={{
                      borderColor: 'rgba(255,255,255,0.14)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px', padding: '1.25rem 1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Category + date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                          <span style={{
                            background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)',
                            fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.55rem',
                            borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
                          }}>
                            {s.category}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.76rem' }}>
                            {formatDate(s.createdAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.45rem', letterSpacing: '-0.01em' }}>
                          {s.title}
                        </div>

                        {/* Description */}
                        <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
                          {s.description}
                        </div>

                        {/* Submitted by */}
                        {s.submittedBy && (
                          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.3)' }}>
                            By: <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.submittedBy.name}</span>
                            {' · '}{s.submittedBy.email}
                          </div>
                        )}
                      </div>

                      {/* Right side */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', flexShrink: 0 }}>
                        {/* Status badge */}
                        <motion.span
                          layout
                          style={{
                            background: statusStyle.bg, color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontSize: '0.68rem', fontWeight: 800,
                            padding: '0.22rem 0.65rem', borderRadius: '20px',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            boxShadow: `0 2px 10px ${statusStyle.color}22`,
                          }}
                        >
                          {s.status}
                        </motion.span>

                        {/* Status change */}
                        <motion.select
                          whileHover={{ borderColor: 'rgba(255,255,255,0.25)' }}
                          value={s.status}
                          onChange={(e) => handleStatusChange(s._id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '7px', color: 'rgba(255,255,255,0.65)',
                            fontSize: '0.75rem', cursor: 'pointer', outline: 'none',
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} style={{ background: '#1a1a1a' }}>{opt}</option>
                          ))}
                        </motion.select>

                        {/* Delete */}
                        <motion.button
                          whileHover={{ scale: 1.04, background: 'rgba(255,69,0,0.22)' }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleDelete(s._id)}
                          style={{
                            padding: '0.35rem 0.8rem',
                            background: 'rgba(255,69,0,0.08)',
                            border: '1px solid rgba(255,69,0,0.22)',
                            borderRadius: '7px', color: '#ff4500',
                            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          Delete
                        </motion.button>
                      </div>
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
