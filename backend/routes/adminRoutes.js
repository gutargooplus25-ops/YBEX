const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getDashboardStats,
  getAdminContacts, updateContactStatus, approveContact, rejectContact, replyContact, deleteContact,
  getAdminUsers, updateUserRole, deleteAdminUser,
  getAdminSuggestions, updateAdminSuggestion, deleteAdminSuggestion,
  getTeamMembers, addTeamMember, deleteTeamMember,
} = require('../controllers/adminController');
const Influencer = require('../models/Influencer');
const Brand = require('../models/Brand');

const router = express.Router();

// ── Multer ────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const fileFilter = (req, file, cb) => {
  file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Auth guard ────────────────────────────────────────────────────
router.use(protect, adminOnly);

// ── Dashboard ─────────────────────────────────────────────────────
router.get('/stats', getDashboardStats);

// ── Contacts / Enquiries ──────────────────────────────────────────
router.get('/contacts',              getAdminContacts);
router.patch('/contacts/:id',        updateContactStatus);
router.patch('/contacts/:id/approve', approveContact);
router.patch('/contacts/:id/reject',  rejectContact);
router.post('/contacts/:id/reply',    replyContact);
router.delete('/contacts/:id',        deleteContact);

// ── Users ─────────────────────────────────────────────────────────
router.get('/users',              getAdminUsers);
router.patch('/users/:id/role',   updateUserRole);
router.delete('/users/:id',       deleteAdminUser);

// ── Suggestions ───────────────────────────────────────────────────
router.get('/suggestions',          getAdminSuggestions);
router.patch('/suggestions/:id',    updateAdminSuggestion);
router.delete('/suggestions/:id',   deleteAdminSuggestion);

// ── Team Members ──────────────────────────────────────────────────
router.get('/team-members',        getTeamMembers);
router.post('/team-members',       addTeamMember);
router.delete('/team-members/:id', deleteTeamMember);

// ── Influencers ───────────────────────────────────────────────────
router.get('/influencers', async (req, res, next) => {
  try {
    const influencers = await Influencer.find().sort({ createdAt: -1 });
    res.json({ success: true, influencers });
  } catch (e) { next(e); }
});

router.post('/influencers', async (req, res, next) => {
  try {
    const { name, profileLink, imageUrl } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const influencer = await Influencer.create({
      name: name.trim(),
      profileLink: profileLink || '',
      imageUrl: imageUrl?.trim() || null,
    });
    res.status(201).json({ success: true, influencer });
  } catch (e) { next(e); }
});

router.delete('/influencers/:id', async (req, res, next) => {
  try {
    const inf = await Influencer.findByIdAndDelete(req.params.id);
    if (!inf) return res.status(404).json({ message: 'Not found' });
    // Only delete local file if it was a local upload (not an external URL)
    if (inf.imageUrl && inf.imageUrl.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '../uploads', path.basename(inf.imageUrl));
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ── Brands ────────────────────────────────────────────────────────
router.get('/brands', async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json({ success: true, brands });
  } catch (e) { next(e); }
});

router.post('/brands', async (req, res, next) => {
  try {
    const { name, websiteLink, logoUrl } = req.body;
    if (!name?.trim())        return res.status(400).json({ message: 'Brand name is required' });
    if (!websiteLink?.trim()) return res.status(400).json({ message: 'Website link is required' });
    if (!logoUrl?.trim())     return res.status(400).json({ message: 'Logo image URL is required' });
    const brand = await Brand.create({
      name: name.trim(),
      logoUrl: logoUrl.trim(),
      websiteLink: websiteLink.trim(),
    });
    res.status(201).json({ success: true, brand });
  } catch (e) { next(e); }
});

router.delete('/brands/:id', async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Not found' });
    // Only delete local file if it was a local upload
    if (brand.logoUrl && brand.logoUrl.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '../uploads', path.basename(brand.logoUrl));
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ success: true });
  } catch (e) { next(e); }
});

// Public endpoint for homepage brands
module.exports = router;
