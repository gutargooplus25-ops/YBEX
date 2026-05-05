const express = require('express');
const Scholarship = require('../models/Scholarship');
const { protect, adminOnly } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');

const router = express.Router();

// ── Public: Submit scholarship application ────────────────────────
router.post('/apply', async (req, res, next) => {
  try {
    const { fullName, email, phone, preferredTrack, portfolioUrl, reason, background } = req.body;

    // Validation
    if (!fullName?.trim()) return res.status(400).json({ message: 'Full name is required' });
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });
    if (!phone?.trim()) return res.status(400).json({ message: 'Phone number is required' });
    if (!preferredTrack) return res.status(400).json({ message: 'Preferred track is required' });
    if (!reason?.trim()) return res.status(400).json({ message: 'Please tell us why you deserve this opportunity' });
    if (!background?.trim()) return res.status(400).json({ message: 'Please tell us about your background' });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Please provide a valid email address' });

    // Create scholarship application
    const scholarship = await Scholarship.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      preferredTrack,
      portfolioUrl: portfolioUrl?.trim() || '',
      reason: reason.trim(),
      background: background.trim(),
      status: 'pending',
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Your scholarship application has been submitted successfully!',
      scholarship,
    });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Get all scholarship applications ───────────────────────
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, isRead, page = 1, limit = 20 } = req.query;
    const filter = { deletedAt: null };

    if (status) filter.status = status;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [scholarships, total] = await Promise.all([
      Scholarship.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('reviewedBy', 'name email'),
      Scholarship.countDocuments(filter),
    ]);

    res.json({
      success: true,
      scholarships,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Get scholarship stats ────────────────────────────────────
router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [total, pending, underReview, approved, rejected, shortlisted, unread] = await Promise.all([
      Scholarship.countDocuments({ deletedAt: null }),
      Scholarship.countDocuments({ status: 'pending', deletedAt: null }),
      Scholarship.countDocuments({ status: 'under_review', deletedAt: null }),
      Scholarship.countDocuments({ status: 'approved', deletedAt: null }),
      Scholarship.countDocuments({ status: 'rejected', deletedAt: null }),
      Scholarship.countDocuments({ status: 'shortlisted', deletedAt: null }),
      Scholarship.countDocuments({ isRead: false, deletedAt: null }),
    ]);

    res.json({
      success: true,
      stats: { total, pending, underReview, approved, rejected, shortlisted, unread },
    });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Get single scholarship application ─────────────────────
router.get('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate('reviewedBy', 'name email');
    if (!scholarship || scholarship.deletedAt) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    res.json({ success: true, scholarship });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Update read status ─────────────────────────────────────
router.patch('/:id/read', protect, adminOnly, async (req, res, next) => {
  try {
    const { isRead } = req.body;
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!scholarship || scholarship.deletedAt) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    res.json({ success: true, scholarship });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Update application status ─────────────────────────────
router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'shortlisted'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship || scholarship.deletedAt) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    const previousStatus = scholarship.status;

    scholarship.status = status;
    scholarship.isRead = true;
    if (adminNotes?.trim()) scholarship.adminNotes = adminNotes.trim();
    if (status !== 'pending') {
      scholarship.reviewedBy = req.user._id;
      scholarship.reviewedAt = new Date();
    }

    await scholarship.save();

    // Log activity
    await logActivity({
      req,
      action: 'UPDATE_SCHOLARSHIP_STATUS',
      entityType: 'SCHOLARSHIP',
      entityId: scholarship._id.toString(),
      entityName: scholarship.fullName,
      details: {
        previousStatus,
        newStatus: status,
        applicantEmail: scholarship.email,
      },
    });

    res.json({ success: true, scholarship });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Add admin notes ────────────────────────────────────────
router.patch('/:id/notes', protect, adminOnly, async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { adminNotes: adminNotes?.trim() || '' },
      { new: true }
    );
    if (!scholarship || scholarship.deletedAt) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    res.json({ success: true, scholarship });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Soft delete scholarship application ────────────────────
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship || scholarship.deletedAt) {
      return res.status(404).json({ message: 'Scholarship application not found' });
    }

    scholarship.deletedAt = new Date();
    scholarship.deletedBy = req.user._id;
    await scholarship.save();

    // Log activity
    await logActivity({
      req,
      action: 'DELETE_SCHOLARSHIP',
      entityType: 'SCHOLARSHIP',
      entityId: scholarship._id.toString(),
      entityName: scholarship.fullName,
      details: {
        applicantEmail: scholarship.email,
        status: scholarship.status,
        movedToBin: true,
      },
    });

    res.json({ success: true, message: 'Scholarship application moved to bin' });
  } catch (e) {
    next(e);
  }
});

// ── Admin: Restore from bin ───────────────────────────────────────
router.patch('/:id/restore', protect, adminOnly, async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship application not found' });
    if (!scholarship.deletedAt) return res.status(400).json({ message: 'Application is not in bin' });

    scholarship.deletedAt = null;
    scholarship.deletedBy = null;
    await scholarship.save();

    // Log activity
    await logActivity({
      req,
      action: 'RESTORE_SCHOLARSHIP',
      entityType: 'SCHOLARSHIP',
      entityId: scholarship._id.toString(),
      entityName: scholarship.fullName,
      details: { applicantEmail: scholarship.email },
    });

    res.json({ success: true, scholarship });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
