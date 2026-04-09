import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.25 } },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axiosInstance.get('/admin/users')
      .then((res) => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      const res = await axiosInstance.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === id ? res.data.user : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
            Manage Users
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}
          >
            {users.length} total registered users
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          style={{ position: 'relative' }}
        >
          <span style={{
            position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.65rem 1rem 0.65rem 2.25rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: '#fff', fontSize: '0.85rem',
              outline: 'none', width: '270px', transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff4500';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,69,0,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </motion.div>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              style={{
                height: '60px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 100px 130px 100px',
            padding: '0.8rem 1.5rem',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            fontSize: '0.68rem', fontWeight: 800,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: '3.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👤</div>
                No users found.
              </motion.div>
            ) : (
              filtered.map((user, i) => (
                <motion.div
                  key={user._id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  whileHover={{ background: 'rgba(255,255,255,0.025)' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr 100px 130px 100px',
                    padding: '1rem 1.5rem',
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  {/* Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: user.role === 'admin' ? 'rgba(255,69,0,0.18)' : 'rgba(255,255,255,0.07)',
                        border: user.role === 'admin' ? '1px solid rgba(255,69,0,0.45)' : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 800,
                        color: user.role === 'admin' ? '#ff4500' : 'rgba(255,255,255,0.55)',
                        flexShrink: 0,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </motion.div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{user.name}</span>
                  </div>

                  {/* Email */}
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{user.email}</span>

                  {/* Role */}
                  <motion.span
                    layout
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 800,
                      background: user.role === 'admin' ? 'rgba(255,69,0,0.15)' : 'rgba(255,255,255,0.07)',
                      color: user.role === 'admin' ? '#ff4500' : 'rgba(255,255,255,0.45)',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      border: user.role === 'admin' ? '1px solid rgba(255,69,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {user.role === 'admin' ? '⭐ ' : ''}{user.role}
                  </motion.span>

                  {/* Joined */}
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                    {formatDate(user.createdAt)}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <motion.button
                      whileHover={{ scale: 1.1, borderColor: '#ff4500' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRoleToggle(user._id, user.role)}
                      title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                      style={{
                        width: '32px', height: '32px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '7px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      {user.role === 'admin' ? '👤' : '⭐'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, background: 'rgba(255,69,0,0.25)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(user._id)}
                      title="Delete user"
                      style={{
                        width: '32px', height: '32px',
                        background: 'rgba(255,69,0,0.08)',
                        border: '1px solid rgba(255,69,0,0.2)',
                        borderRadius: '7px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      🗑
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}
