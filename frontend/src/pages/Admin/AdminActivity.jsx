import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const ACCENT = '#e4f141';
const BORDER = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const DIM = 'rgba(255,255,255,0.1)';

// Activity icon mapping
const getActivityIcon = (action) => {
  const icons = {
    'CREATE': '➕',
    'UPDATE': '✏️',
    'DELETE': '🗑️',
    'LOGIN': '🔐',
    'LOGOUT': '👋',
    'ADD_BRAND': '🏷️',
    'UPDATE_BRAND': '🏷️',
    'DELETE_BRAND': '🗑️',
    'ADD_SUCCESS_STORY': '🏆',
    'UPDATE_SUCCESS_STORY': '🏆',
    'DELETE_SUCCESS_STORY': '🗑️',
    'ADD_TEAM_MEMBER': '👤',
    'DELETE_TEAM_MEMBER': '🗑️',
    'ADD_INFLUENCER': '🌟',
    'DELETE_INFLUENCER': '🗑️',
    'UPDATE_HIRING_STATUS': '💼',
    'DELETE_HIRING_APPLICATION': '🗑️',
    'ADD_INVOICE': '🧾',
    'UPDATE_INVOICE': '🧾',
    'DELETE_INVOICE': '🗑️',
    'UPDATE_USER_ROLE': '👥',
    'DELETE_USER': '🗑️',
    'UPDATE_ENQUIRY_STATUS': '📬',
    'DELETE_ENQUIRY': '🗑️',
    'ADD_SUGGESTION': '💡',
    'UPDATE_SUGGESTION': '💡',
    'DELETE_SUGGESTION': '🗑️',
    'SYSTEM': '⚙️',
    'OTHER': '📌'
  };
  return icons[action] || '📌';
};

// Activity color mapping
const getActivityColor = (action) => {
  if (action.includes('DELETE')) return '#FF3D10';
  if (action.includes('ADD') || action.includes('CREATE')) return '#22c55e';
  if (action.includes('UPDATE')) return '#3b82f6';
  if (action.includes('LOGIN')) return '#a78bfa';
  if (action.includes('LOGOUT')) return '#f59e0b';
  return ACCENT;
};

// Format timestamp
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // Less than 1 minute
  if (diff < 60000) return 'Just now';
  // Less than 1 hour
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  // Less than 24 hours
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  // Less than 7 days
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Activity Card Component
function ActivityCard({ activity, index }) {
  const icon = getActivityIcon(activity.action);
  const color = getActivityColor(activity.action);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: `0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}40`
      }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${BORDER}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6
      }} />
      
      {/* Icon */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        flexShrink: 0
      }}>
        {icon}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#fff'
          }}>
            {activity.action.replace(/_/g, ' ')}
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: MUTED
          }}>
            {formatTime(activity.createdAt)}
          </span>
        </div>
        
        {activity.entityName && (
          <div style={{
            fontSize: '0.85rem',
            color: color,
            marginTop: '4px',
            fontWeight: 500
          }}>
            {activity.entityName}
          </div>
        )}
        
        <div style={{
          fontSize: '0.8rem',
          color: MUTED,
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>by</span>
          <span style={{ color: '#fff', fontWeight: 500 }}>{activity.adminName}</span>
          <span style={{ 
            width: '4px', 
            height: '4px', 
            borderRadius: '50%', 
            background: DIM 
          }} />
          <span>{activity.entityType}</span>
        </div>
        
        {activity.status === 'FAILED' && (
          <div style={{
            marginTop: '8px',
            padding: '6px 10px',
            background: 'rgba(255,61,16,0.1)',
            border: '1px solid rgba(255,61,16,0.3)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#FF3D10'
          }}>
            ⚠️ {activity.errorMessage || 'Action failed'}
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: activity.status === 'SUCCESS' ? '#22c55e' : '#FF3D10',
        flexShrink: 0,
        boxShadow: `0 0 10px ${activity.status === 'SUCCESS' ? '#22c55e' : '#FF3D10'}60`
      }} />
    </motion.div>
  );
}

// Animated Slider Component
function ActivitySlider({ activities, title, icon }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  
  useEffect(() => {
    if (activities.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [activities.length, isPaused]);
  
  if (activities.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, rgba(228,241,65,0.05) 0%, rgba(255,61,16,0.02) 100%)',
        border: `1px solid ${BORDER}`,
        borderRadius: '24px',
        padding: '1.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(228,241,65,0.03) 50%, transparent 100%)',
        animation: 'shimmer 3s ease-in-out infinite'
      }} />
      
      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT}10 100%)`,
            border: `1px solid ${ACCENT}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            {icon}
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#fff',
              margin: 0
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: MUTED,
              margin: '4px 0 0 0'
            }}>
              Auto-scrolling through {activities.length} activities
            </p>
          </div>
        </div>
        
        {/* Progress dots */}
        <div style={{
          display: 'flex',
          gap: '6px'
        }}>
          {activities.slice(0, 5).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === currentIndex % 5 ? 1.2 : 1,
                backgroundColor: i === currentIndex % 5 ? ACCENT : DIM
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
      
      {/* Slider Content */}
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          height: '100px',
          overflow: 'hidden'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0 0.5rem'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${getActivityColor(activities[currentIndex].action)}30 0%, ${getActivityColor(activities[currentIndex].action)}10 100%)`,
              border: `1px solid ${getActivityColor(activities[currentIndex].action)}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem'
            }}>
              {getActivityIcon(activities[currentIndex].action)}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#fff'
              }}>
                {activities[currentIndex].action.replace(/_/g, ' ')}
              </div>
              {activities[currentIndex].entityName && (
                <div style={{
                  fontSize: '0.9rem',
                  color: getActivityColor(activities[currentIndex].action),
                  marginTop: '4px'
                }}>
                  {activities[currentIndex].entityName}
                </div>
              )}
              <div style={{
                fontSize: '0.8rem',
                color: MUTED,
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>by {activities[currentIndex].adminName}</span>
                <span>•</span>
                <span>{formatTime(activities[currentIndex].createdAt)}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Pause indicator */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${BORDER}`,
              borderRadius: '20px',
              fontSize: '0.7rem',
              color: MUTED
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>⏸️</span>
            Paused
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Stats Card Component
function StatCard({ label, value, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${BORDER}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: MUTED,
          marginTop: '4px'
        }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// Main Component
export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const filters = [
    { key: 'ALL', label: 'All Activities', icon: '📋' },
    { key: 'CREATE', label: 'Created', icon: '➕' },
    { key: 'UPDATE', label: 'Updated', icon: '✏️' },
    { key: 'DELETE', label: 'Deleted', icon: '🗑️' },
    { key: 'LOGIN', label: 'Logins', icon: '🔐' }
  ];

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [filter]);
  
  const fetchActivities = async (append = false) => {
    try {
      const currentPage = append ? page + 1 : 1;
      const params = { 
        page: currentPage, 
        limit: 20,
        ...(filter !== 'ALL' && { action: filter })
      };
      
      const { data } = await axiosInstance.get('/activity', { params });
      
      if (append) {
        setActivities(prev => [...prev, ...data.activities]);
        setPage(currentPage);
      } else {
        setActivities(data.activities);
        setPage(1);
      }
      
      setHasMore(data.activities.length === 20);
      setLoading(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load activities');
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get('/activity/stats?days=7');
      setStats(data.stats);
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };
  
  const loadMore = () => {
    fetchActivities(true);
  };
  
  // Get recent and important activities for slider
  const recentActivities = activities.slice(0, 5);
  const importantActivities = activities.filter(a => 
    a.action.includes('DELETE') || a.status === 'FAILED'
  ).slice(0, 5);

  return (
    <AdminLayout>
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginBottom: '2rem'
          }}
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
                <span style={{ fontSize: '2rem' }}>📊</span>
                Activity Logs
              </h1>
              <p style={{
                fontSize: '0.9rem',
                color: MUTED,
                margin: '8px 0 0 0'
              }}>
                Track all admin actions and system activities in real-time
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setLoading(true); fetchActivities(); fetchStats(); }}
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
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <StatCard
              label="Total Activities (7d)"
              value={stats.totalCount}
              icon="📈"
              color={ACCENT}
              delay={0}
            />
            <StatCard
              label="Most Common Action"
              value={stats.actionStats[0]?._id?.replace(/_/g, ' ') || 'N/A'}
              icon="⚡"
              color="#3b82f6"
              delay={0.1}
            />
            <StatCard
              label="Most Active Entity"
              value={stats.entityStats[0]?._id || 'N/A'}
              icon="🎯"
              color="#22c55e"
              delay={0.2}
            />
            <StatCard
              label="Today's Activity"
              value={stats.dailyStats[0]?.count || 0}
              icon="📅"
              color="#a78bfa"
              delay={0.3}
            />
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '0.6rem 1rem',
                background: filter === f.key 
                  ? `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT}10 100%)` 
                  : 'transparent',
                border: `1px solid ${filter === f.key ? ACCENT : 'transparent'}`,
                borderRadius: '10px',
                color: filter === f.key ? ACCENT : MUTED,
                fontSize: '0.8rem',
                fontWeight: filter === f.key ? 600 : 500,
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

        {/* Animated Sliders */}
        {recentActivities.length > 0 && (
          <ActivitySlider
            activities={recentActivities}
            title="Recent Activities"
            icon="🕐"
          />
        )}

        {importantActivities.length > 0 && (
          <ActivitySlider
            activities={importantActivities}
            title="Important Actions"
            icon="⚠️"
          />
        )}

        {/* Activity Grid */}
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
        ) : activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '4rem',
              textAlign: 'center',
              color: MUTED
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
              No activities found
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Activities will appear here when admins perform actions
            </div>
          </motion.div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1rem'
            }}>
              <AnimatePresence mode="popLayout">
                {activities.map((activity, index) => (
                  <ActivityCard
                    key={activity._id}
                    activity={activity}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {/* Load More */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '2rem'
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadMore}
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${BORDER}`,
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Load More Activities
                  <span>↓</span>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
