import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function AdminSuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    earning: '',
    company: '',
    initials: '',
    isActive: true
  });

  // Fetch stories
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/success-stories/admin`);
      setStories(res.data.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (story = null) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        name: story.name,
        role: story.role,
        quote: story.quote,
        earning: story.earning,
        company: story.company,
        initials: story.initials,
        isActive: story.isActive
      });
      setPreviewImage(story.imageUrl);
    } else {
      setEditingStory(null);
      setFormData({
        name: '',
        role: '',
        quote: '',
        earning: '',
        company: '',
        initials: '',
        isActive: true
      });
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStory(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        imageUrl: previewImage
      };

      if (editingStory) {
        await axios.put(`${API_URL}/success-stories/${editingStory._id}`, submitData);
      } else {
        await axios.post(`${API_URL}/success-stories`, submitData);
      }

      handleCloseModal();
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await axios.delete(`${API_URL}/success-stories/${id}`);
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', padding: '2rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          SUCCESS STORIES
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage student success stories for the Academy page</p>
      </motion.div>

      {/* Add Story Button */}
      <motion.button
        onClick={() => handleOpenModal()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>+</span> ADD SUCCESS STORY
      </motion.button>

      {/* Stories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>
          Loading...
        </div>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>
          No success stories yet. Add your first story!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {stories.map((story, index) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${story.isActive ? 'rgba(255,77,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                position: 'relative'
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: story.isActive ? 'rgba(255,77,0,0.2)' : 'rgba(255,255,255,0.1)',
                color: story.isActive ? '#ff6b35' : 'rgba(255,255,255,0.5)'
              }}>
                {story.isActive ? 'ACTIVE' : 'INACTIVE'}
              </div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255,77,0,0.3)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700
                  }}>
                    {story.initials || getInitials(story.name)}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{story.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#ff6b35', margin: 0 }}>{story.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.5,
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>
                "{story.quote.substring(0, 100)}{story.quote.length > 100 ? '...' : ''}"
              </p>

              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontWeight: 700 }}>{story.earning}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{story.company}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                <motion.button
                  onClick={() => handleOpenModal(story)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(story._id)}
                  whileHover={{ scale: 1.05, background: 'rgba(255,61,16,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255,61,16,0.1)',
                    border: '1px solid rgba(255,61,16,0.3)',
                    color: '#FF3D10',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
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
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(255,77,0,0.3)',
                padding: '2rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  📝
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
                  {editingStory ? 'Edit Success Story' : 'Add Success Story'}
                </h2>
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  Profile Photo
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(255,77,0,0.5)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '2px dashed rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      📷
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {previewImage ? 'Change Photo' : 'Upload Photo'}
                    </motion.button>
                    {previewImage && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          marginLeft: '8px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(255,61,16,0.1)',
                          border: '1px solid rgba(255,61,16,0.3)',
                          color: '#FF3D10',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Remove
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. ARYAN MEHTA"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. CONTENT CREATOR"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Revenue *
                    </label>
                    <input
                      type="text"
                      name="earning"
                      value={formData.earning}
                      onChange={handleInputChange}
                      placeholder="e.g. ₹3.2L/mo"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Company/Status *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. SELF-BUILT"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px'
                  }}>
                    Student Quote *
                  </label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    placeholder="Enter the student's testimonial..."
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Active Toggle */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                      Active (visible on Academy page)
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {editingStory ? 'Update Story' : 'Add Story'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
