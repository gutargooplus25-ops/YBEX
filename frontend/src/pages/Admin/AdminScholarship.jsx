import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

// ── Status Configurations ────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
    icon: '⏳',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  under_review: {
    label: 'Under Review',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    icon: '🔍',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  shortlisted: {
    label: 'Shortlisted',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.4)',
    icon: '⭐',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  approved: {
    label: 'Approved',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.4)',
    icon: '✅',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
  },
  rejected: {
    label: 'Rejected',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.4)',
    icon: '❌',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
};

const FILTERS = [
  { key: 'all', label: 'All Applications', icon: '📋' },
  { key: 'pending', label: 'Pending', icon: '⏳' },
  { key: 'under_review', label: 'Under Review', icon: '🔍' },
  { key: 'shortlisted', label: 'Shortlisted', icon: '⭐' },
  { key: 'approved', label: 'Approved', icon: '✅' },
  { key: 'rejected', label: 'Rejected', icon: '❌' },
];

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ── Animated Stat Card ──────────────────────────────────────────
function StatCard({ label, value, icon, color, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Glow Effect */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: 0,
          background: gradient,
          opacity: 0.1,
          filter: 'blur(20px)',
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '1.75rem' }}>{icon}</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: delay * 2 }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {value}
        </motion.div>
        
        <div style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)',
          marginTop: '6px',
          fontWeight: 500,
        }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ── Premium Application Card ────────────────────────────────────
function ApplicationCard({ scholarship, onClick }) {
  const status = STATUS_CONFIG[scholarship.status] || STATUS_CONFIG.pending;
  const isUnread = !scholarship.isRead;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, y: -3 }}
      onClick={() => onClick(scholarship)}
      style={{
        background: isUnread 
          ? 'linear-gradient(145deg, rgba(255,77,0,0.08) 0%, rgba(255,255,255,0.03) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: isUnread ? '1px solid rgba(255,77,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '18px',
        padding: '24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Unread Indicator */}
      {isUnread && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ff4d00',
            boxShadow: '0 0 10px #ff4d00',
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Avatar */}
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: status.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
          }}
        >
          {scholarship.fullName.charAt(0).toUpperCase()}
        </motion.div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '6px',
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
            }}>
              {scholarship.fullName}
            </h3>
            <span style={{
              padding: '4px 10px',
              background: status.bg,
              border: `1px solid ${status.border}`,
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: status.color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {status.icon} {status.label}
            </span>
          </div>

          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '8px',
          }}>
            {scholarship.email} · {scholarship.phone}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.6)',
            }}>
              🎓 {scholarship.preferredTrack}
            </span>
            <span style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)',
            }}>
              📅 {formatDate(scholarship.createdAt)}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Detail Modal ────────────────────────────────────────────────
function DetailModal({ scholarship, onClose, onStatusChange, onAddNotes, onMarkRead }) {
  const [notes, setNotes] = useState(scholarship.adminNotes || '');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const status = STATUS_CONFIG[scholarship.status] || STATUS_CONFIG.pending;

  const handleStatusUpdate = async (newStatus) => {
    await onStatusChange(scholarship._id, newStatus, notes);
    setShowStatusMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 20%, rgba(255,77,0,0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 80%, rgba(255,77,0,0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 20%, rgba(255,77,0,0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(145deg, #111 0%, #0a0a0a 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          ✕
        </motion.button>

        {/* Header */}
        <div style={{
          background: status.gradient,
          padding: '32px',
          borderRadius: '24px 24px 0 0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative Circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}>
                {scholarship.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0,
                }}>
                  {scholarship.fullName}
                </h2>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  margin: '4px 0 0',
                }}>
                  {scholarship.email}
                </p>
              </div>
            </div>

            <span style={{
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {status.icon} {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '28px',
          }}>
            <div>
              <label style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                Phone
              </label>
              <p style={{
                fontSize: '1rem',
                color: '#fff',
                margin: '6px 0 0',
                fontWeight: 500,
              }}>
                {scholarship.phone}
              </p>
            </div>
            <div>
              <label style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                Preferred Track
              </label>
              <p style={{
                fontSize: '1rem',
                color: '#fff',
                margin: '6px 0 0',
                fontWeight: 500,
              }}>
                🎓 {scholarship.preferredTrack}
              </p>
            </div>
          </div>

          {/* Portfolio */}
          {scholarship.portfolioUrl && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                display: 'block',
                marginBottom: '8px',
              }}>
                Portfolio / Profile
              </label>
              <a
                href={scholarship.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'rgba(255,77,0,0.1)',
                  border: '1px solid rgba(255,77,0,0.3)',
                  borderRadius: '12px',
                  color: '#ff6b35',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                }}
              >
                🔗 View Portfolio →
              </a>
            </div>
          )}

          {/* Why They Deserve */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '10px',
            }}>
              Why They Deserve This Opportunity
            </label>
            <div style={{
              padding: '16px 20px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
            }}>
              {scholarship.reason}
            </div>
          </div>

          {/* Background */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '10px',
            }}>
              Background
            </label>
            <div style={{
              padding: '16px 20px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
            }}>
              {scholarship.background}
            </div>
          </div>

          {/* Admin Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '10px',
            }}>
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              rows={3}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                color: '#fff',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            {/* Status Change Button */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                style={{
                  padding: '14px 24px',
                  background: status.gradient,
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {status.icon} Update Status ▼
              </motion.button>

              <AnimatePresence>
                {showStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '8px',
                      background: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      zIndex: 100,
                      minWidth: '200px',
                    }}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <motion.button
                        key={key}
                        whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                        onClick={() => handleStatusUpdate(key)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'transparent',
                          border: 'none',
                          color: config.color,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.9rem',
                        }}
                      >
                        {config.icon} {config.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save Notes Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddNotes(scholarship._id, notes)}
              style={{
                padding: '14px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              💾 Save Notes
            </motion.button>

            {/* Mark as Read/Unread */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMarkRead(scholarship._id, scholarship.isRead)}
              style={{
                padding: '14px 24px',
                background: scholarship.isRead ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                border: `1px solid ${scholarship.isRead ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                borderRadius: '12px',
                color: scholarship.isRead ? '#ef4444' : '#22c55e',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {scholarship.isRead ? '🔴 Mark Unread' : '🟢 Mark Read'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function AdminScholarship() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    shortlisted: 0,
    unread: 0,
  });
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchScholarships = async (filter = 'all') => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/scholarships' : `/scholarships?status=${filter}`;
      const res = await axiosInstance.get(url);
      setScholarships(res.data.scholarships || []);
    } catch (e) {
      console.error('Failed to fetch scholarships:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/scholarships/stats');
      setStats(res.data.stats);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  };

  useEffect(() => {
    fetchScholarships();
    fetchStats();
  }, []);

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    fetchScholarships(key);
  };

  const handleStatusChange = async (id, newStatus, notes = '') => {
    try {
      const res = await axiosInstance.patch(`/scholarships/${id}/status`, {
        status: newStatus,
        adminNotes: notes,
      });
      setScholarships(prev => prev.map(s => s._id === id ? res.data.scholarship : s));
      setSelectedScholarship(res.data.scholarship);
      fetchStats();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleAddNotes = async (id, notes) => {
    try {
      const res = await axiosInstance.patch(`/scholarships/${id}/notes`, { adminNotes: notes });
      setScholarships(prev => prev.map(s => s._id === id ? res.data.scholarship : s));
      setSelectedScholarship(res.data.scholarship);
    } catch (e) {
      console.error('Failed to add notes:', e);
    }
  };

  const handleMarkRead = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.patch(`/scholarships/${id}/read`, { isRead: !currentStatus });
      setScholarships(prev => prev.map(s => s._id === id ? res.data.scholarship : s));
      if (selectedScholarship?._id === id) {
        setSelectedScholarship(res.data.scholarship);
      }
      fetchStats();
    } catch (e) {
      console.error('Failed to mark as read:', e);
    }
  };

  const filteredScholarships = scholarships.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.preferredTrack.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(255,77,0,0)',
                '0 0 20px 5px rgba(255,77,0,0.3)',
                '0 0 0 0 rgba(255,77,0,0)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff4d00 0%, #ff6b35 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            🎖️
          </motion.div>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              YBEX Talent Fund
            </h1>
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              margin: '0.25rem 0 0',
            }}>
              Manage scholarship applications and talent awards
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon="📋"
          color="#ffffff"
          gradient="linear-gradient(135deg, #ffffff, #a0a0a0)"
          delay={0}
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon="⏳"
          color="#f59e0b"
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          delay={0.1}
        />
        <StatCard
          label="Under Review"
          value={stats.underReview}
          icon="🔍"
          color="#3b82f6"
          gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
          delay={0.2}
        />
        <StatCard
          label="Shortlisted"
          value={stats.shortlisted}
          icon="⭐"
          color="#8b5cf6"
          gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
          delay={0.3}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon="✅"
          color="#22c55e"
          gradient="linear-gradient(135deg, #22c55e, #16a34a)"
          delay={0.4}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon="❌"
          color="#ef4444"
          gradient="linear-gradient(135deg, #ef4444, #dc2626)"
          delay={0.5}
        />
      </div>

      {/* Filters & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          {FILTERS.map((filter, index) => {
            const isActive = activeFilter === filter.key;
            const count = filter.key === 'all'
              ? stats.total
              : stats[filter.key === 'under_review' ? 'underReview' : filter.key] || 0;

            return (
              <motion.button
                key={filter.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={!isActive ? { y: -2 } : {}}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFilterChange(filter.key)}
                style={{
                  padding: '0.75rem 1rem',
                  background: isActive
                    ? 'linear-gradient(135deg, #ff4d00 0%, #ff6b35 100%)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? '#ff4d00' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isActive ? '0 4px 20px rgba(255,77,0,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
                {count > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(255,77,0,0.2)',
                    color: isActive ? '#fff' : '#ff6b35',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                    marginLeft: '0.25rem',
                  }}>
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            position: 'relative',
            minWidth: '280px',
          }}
        >
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1rem',
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search applicants by name, email, or track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem 0.875rem 2.75rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255,77,0,0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </motion.div>
      </div>

      {/* Applications List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                style={{
                  height: '160px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
            ))}
          </motion.div>
        ) : filteredScholarships.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '4rem',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
            >
              🎓
            </motion.div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 0.5rem',
            }}>
              No Applications Found
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
            }}>
              {searchQuery
                ? 'No applicants match your search criteria.'
                : 'Scholarship applications will appear here when submitted.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <AnimatePresence>
              {filteredScholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ApplicationCard
                    scholarship={scholarship}
                    onClick={(s) => {
                      setSelectedScholarship(s);
                      if (!s.isRead) handleMarkRead(s._id, s.isRead);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <DetailModal
            scholarship={selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
            onStatusChange={handleStatusChange}
            onAddNotes={handleAddNotes}
            onMarkRead={handleMarkRead}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
