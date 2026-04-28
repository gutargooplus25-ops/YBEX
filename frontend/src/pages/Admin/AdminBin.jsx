import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

// Colors matching the premium admin theme
const ACCENT = '#E4F141';
const MUTED = 'rgba(255,255,255,0.45)';
const DIM = 'rgba(255,255,255,0.08)';
const BORDER = 'rgba(255,255,255,0.06)';

// Item type config with icons and colors
const ITEM_CONFIG = {
  USER: { icon: '👤', color: '#3b82f6', label: 'User' },
  ENQUIRY: { icon: '📧', color: '#22c55e', label: 'Enquiry' },
  TEAM_MEMBER: { icon: '👥', color: '#a78bfa', label: 'Team Member' },
  SUGGESTION: { icon: '💡', color: '#f59e0b', label: 'Suggestion' },
  BRAND: { icon: '🏢', color: '#ec4899', label: 'Brand' },
  SUCCESS_STORY: { icon: '🌟', color: '#10b981', label: 'Success Story' },
  INFLUENCER: { icon: '📱', color: '#8b5cf6', label: 'Influencer' },
  HIRING: { icon: '📝', color: '#06b6d4', label: 'Hiring' },
  INVOICE: { icon: '📄', color: '#f97316', label: 'Invoice' }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.9,
    transition: { duration: 0.4, ease: 'easeInOut' }
  }
};

const deleteAnimation = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotate: -10,
    x: -200,
    transition: { duration: 0.5, ease: 'easeInOut' }
  }
};

const clearAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.8,
    filter: 'blur(10px)',
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AdminBin() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [clearingBin, setClearingBin] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filters = [
    { key: 'ALL', label: 'All Items', icon: '🗑️' },
    { key: 'USER', label: 'Users', icon: '👤' },
    { key: 'ENQUIRY', label: 'Enquiries', icon: '📧' },
    { key: 'TEAM_MEMBER', label: 'Team', icon: '👥' },
    { key: 'SUGGESTION', label: 'Suggestions', icon: '💡' }
  ];

  useEffect(() => {
    fetchBinItems();
    fetchBinStats();
  }, []);

  const fetchBinItems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/bin');
      setItems(data.items || []);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load bin items');
    } finally {
      setLoading(false);
    }
  };

  const fetchBinStats = async () => {
    try {
      const { data } = await axiosInstance.get('/bin/stats');
      setStats(data.stats);
    } catch (e) {
      console.error('Failed to load bin stats:', e);
    }
  };

  const handleRestore = async (type, id) => {
    try {
      await axiosInstance.post(`/bin/restore/${type}/${id}`);
      // Remove from list with animation
      setItems(prev => prev.filter(item => item._id !== id));
      fetchBinStats();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to restore item');
    }
  };

  const handlePermanentDelete = async (type, id) => {
    try {
      setDeletingItem(id);
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 500));
      await axiosInstance.delete(`/bin/${type}/${id}`);
      setItems(prev => prev.filter(item => item._id !== id));
      fetchBinStats();
      setDeletingItem(null);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete item');
      setDeletingItem(null);
    }
  };

  const handleClearBin = async () => {
    try {
      setClearingBin(true);
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 800));
      await axiosInstance.delete('/bin/clear');
      setItems([]);
      fetchBinStats();
      setClearingBin(false);
      setShowClearConfirm(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to clear bin');
      setClearingBin(false);
    }
  };

  const filteredItems = filter === 'ALL'
    ? items
    : items.filter(item => item.itemType === filter);

  return (
    <AdminLayout>
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '2rem' }}>🗑️</span>
                Recycle Bin
              </h1>
              <p style={{
                fontSize: '0.9rem',
                color: MUTED,
                margin: '8px 0 0 0'
              }}>
                Deleted items are stored here. Restore or permanently remove them.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setLoading(true); fetchBinItems(); fetchBinStats(); }}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT}10 100%)`,
                  border: `1px solid ${ACCENT}50`,
                  borderRadius: '12px',
                  color: ACCENT,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🔄</span>
                Refresh
              </motion.button>

              {items.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(239,68,68,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearConfirm(true)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🧹</span>
                  Clear Bin
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {Object.entries(stats).filter(([key]) => key !== 'total').map(([key, count], index) => {
              const config = ITEM_CONFIG[key] || { icon: '📦', color: '#64748b', label: key };
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setFilter(key)}
                  style={{
                    background: filter === key
                      ? `linear-gradient(135deg, ${config.color}25 0%, ${config.color}10 100%)`
                      : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: `1px solid ${filter === key ? config.color + '50' : BORDER}`,
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${config.color}30 0%, ${config.color}15 100%)`,
                    border: `1px solid ${config.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>
                    {config.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#fff',
                      lineHeight: 1
                    }}>
                      {count}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: MUTED,
                      marginTop: '2px'
                    }}>
                      {config.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            padding: '4px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${BORDER}`,
            borderRadius: '14px',
            width: 'fit-content'
          }}
        >
          {filters.map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setFilter(f.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.6rem 1rem',
                background: filter === f.key
                  ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT}dd 100%)`
                  : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: filter === f.key ? '#0d0d0d' : MUTED,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{f.icon}</span>
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              onClick={() => !clearingBin && setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '20px',
                  padding: '2rem',
                  maxWidth: '400px',
                  width: '90%',
                  textAlign: 'center'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)',
                  border: '2px solid rgba(239,68,68,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2.5rem'
                }}>
                  ⚠️
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 0.5rem 0'
                }}>
                  Clear Recycle Bin?
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: MUTED,
                  margin: '0 0 1.5rem 0',
                  lineHeight: 1.5
                }}>
                  This will permanently delete all {items.length} items. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowClearConfirm(false)}
                    disabled={clearingBin}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'transparent',
                      border: `1px solid ${BORDER}`,
                      borderRadius: '12px',
                      color: MUTED,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearBin}
                    disabled={clearingBin}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {clearingBin ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block' }}
                        >
                          ⏳
                        </motion.span>
                        Clearing...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        Clear All
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items Grid */}
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            color: MUTED
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${DIM}`,
                borderTopColor: ACCENT,
                borderRadius: '50%'
              }}
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#FF3D10',
              background: 'rgba(255,61,16,0.05)',
              border: '1px solid rgba(255,61,16,0.2)',
              borderRadius: '16px'
            }}
          >
            ⚠️ {error}
          </motion.div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '4rem',
              textAlign: 'center',
              color: MUTED
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.5 }}>🗑️</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
              {filter === 'ALL' ? 'Bin is empty' : `No ${filters.find(f => f.key === filter)?.label || 'items'} in bin`}
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Deleted items will appear here
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={clearingBin ? clearAnimation : containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1rem'
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const config = ITEM_CONFIG[item.itemType] || { icon: '📦', color: '#64748b', label: item.itemType };
                const isDeleting = deletingItem === item._id;

                return (
                  <motion.div
                    key={item._id}
                    variants={isDeleting ? deleteAnimation : itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                      border: `1px solid ${BORDER}`,
                      borderRadius: '16px',
                      padding: '1.25rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Type Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 10px',
                      background: `linear-gradient(135deg, ${config.color}25 0%, ${config.color}10 100%)`,
                      border: `1px solid ${config.color}40`,
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{config.icon}</span>
                      {config.label}
                    </div>

                    {/* Content */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${config.color}20 0%, ${config.color}10 100%)`,
                        border: `1px solid ${config.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>
                        {config.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#fff',
                          margin: '0 0 4px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.itemName || 'Untitled'}
                        </h4>
                        <p style={{
                          fontSize: '0.8rem',
                          color: MUTED,
                          margin: 0
                        }}>
                          Deleted: {formatDate(item.deletedAt)}
                        </p>
                        {item.deletedBy?.name && (
                          <p style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.3)',
                            margin: '4px 0 0 0'
                          }}>
                            by {item.deletedBy.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(34,197,94,0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRestore(item.itemType, item._id)}
                        disabled={isDeleting}
                        style={{
                          flex: 1,
                          padding: '0.625rem',
                          background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
                          border: '1px solid rgba(34,197,94,0.3)',
                          borderRadius: '10px',
                          color: '#22c55e',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>♻️</span>
                        Restore
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(239,68,68,0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePermanentDelete(item.itemType, item._id)}
                        disabled={isDeleting}
                        style={{
                          flex: 1,
                          padding: '0.625rem',
                          background: isDeleting
                            ? 'rgba(239,68,68,0.3)'
                            : 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '10px',
                          color: '#ef4444',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {isDeleting ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                              style={{ display: 'inline-block', fontSize: '0.9rem' }}
                            >
                              🔄
                            </motion.span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <span>💥</span>
                            Delete
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
