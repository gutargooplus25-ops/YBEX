const User = require('../models/User');
const Contact = require('../models/Contact');
const Suggestion = require('../models/Suggestion');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalContacts, totalSuggestions, unreadContacts, pendingSuggestions] =
      await Promise.all([
        User.countDocuments(),
        Contact.countDocuments(),
        Suggestion.countDocuments(),
        Contact.countDocuments({ isRead: false }),
        Suggestion.countDocuments({ status: 'pending' }),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalContacts,
        totalSuggestions,
        unreadContacts,
        pendingSuggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts with filters
// @route   GET /api/admin/contacts
const getAdminContacts = async (req, res, next) => {
  try {
    const { category, isRead, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Contact.countDocuments(filter),
    ]);

    res.json({ success: true, contacts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact as read / reject
// @route   PATCH /api/admin/contacts/:id
const updateContactStatus = async (req, res, next) => {
  try {
    const { isRead } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/admin/contacts/:id
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
const deleteAdminUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all suggestions (admin)
// @route   GET /api/admin/suggestions
const getAdminSuggestions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const suggestions = await Suggestion.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: suggestions.length, suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update suggestion status
// @route   PATCH /api/admin/suggestions/:id
const updateAdminSuggestion = async (req, res, next) => {
  try {
    const { status } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('submittedBy', 'name email');
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ success: true, suggestion });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete suggestion
// @route   DELETE /api/admin/suggestions/:id
const deleteAdminSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ success: true, message: 'Suggestion deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAdminContacts,
  updateContactStatus,
  deleteContact,
  getAdminUsers,
  updateUserRole,
  deleteAdminUser,
  getAdminSuggestions,
  updateAdminSuggestion,
  deleteAdminSuggestion,
};
