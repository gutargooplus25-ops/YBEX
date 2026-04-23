const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const corsConfig = require('./config/corsConfig');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Public brands endpoint (no auth required)
const Brand = require('./models/Brand');
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json({ success: true, brands });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Public influencers endpoint (no auth required)
const Influencer = require('./models/Influencer');
app.get('/api/influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find().sort({ createdAt: -1 });
    res.json({ success: true, influencers });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} — accessible at http://192.168.0.113:${PORT}`);
});
