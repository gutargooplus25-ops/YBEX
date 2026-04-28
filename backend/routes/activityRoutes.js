const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect, adminOnly);

// Get all activities with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      entityType,
      adminId,
      startDate,
      endDate,
      status
    } = req.query;

    const filter = {};

    // Support pattern matching for action types (e.g., DELETE matches DELETE_USER, DELETE_TEAM_MEMBER, etc.)
    if (action) {
      if (['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'ADD', 'REMOVE'].includes(action)) {
        filter.action = { $regex: action, $options: 'i' };
      } else {
        filter.action = action;
      }
    }
    if (entityType) filter.entityType = entityType;
    if (adminId) filter.adminId = adminId;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Activity.countDocuments(filter)
    ]);

    res.json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (e) { next(e); }
});

// Get activity statistics
router.get('/stats', async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [actionStats, entityStats, dailyStats, totalCount] = await Promise.all([
      // Action type statistics
      Activity.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Entity type statistics
      Activity.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$entityType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Daily activity count
      Activity.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
      ]),
      
      // Total count
      Activity.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    res.json({
      success: true,
      stats: {
        actionStats,
        entityStats,
        dailyStats,
        totalCount,
        periodDays: parseInt(days)
      }
    });
  } catch (e) { next(e); }
});

// Get single activity by ID
router.get('/:id', async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).lean();
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, activity });
  } catch (e) { next(e); }
});

// Create activity log (for manual logging if needed)
router.post('/', async (req, res, next) => {
  try {
    const {
      action,
      entityType,
      entityId,
      entityName,
      details,
      status = 'SUCCESS',
      errorMessage
    } = req.body;

    const activity = await Activity.create({
      adminId: req.user._id,
      adminName: req.user.name || req.user.email,
      adminEmail: req.user.email,
      action,
      entityType,
      entityId,
      entityName,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status,
      errorMessage
    });

    res.status(201).json({ success: true, activity });
  } catch (e) { next(e); }
});

module.exports = router;
