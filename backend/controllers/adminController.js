const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Suggestion = require('../models/Suggestion');
const TeamMember = require('../models/TeamMember');
const Influencer = require('../models/Influencer');
const sendEmail = require('../utils/sendEmail');
const { logActivity } = require('../middleware/activityLogger');

// ── Dashboard stats ──────────────────────────────────────────────
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
    res.json({ success: true, stats: { totalUsers, totalContacts, totalSuggestions, unreadContacts, pendingSuggestions } });
  } catch (e) { next(e); }
};

// ── Contacts ─────────────────────────────────────────────────────
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
  } catch (e) { next(e); }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const { isRead } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (e) { next(e); }
};

const approveContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (e) { next(e); }
};

const rejectContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (e) { next(e); }
};

const replyContact = async (req, res, next) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage?.trim()) return res.status(400).json({ message: 'Reply message is required' });
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    const originalStatus = contact.status;

    // AWAIT the email — admin needs to know if it succeeded or failed
    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject} — YBEX Studio`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;padding:32px;border-radius:16px;">
          <div style="margin-bottom:20px;font-size:1.2rem;font-weight:900;letter-spacing:0.04em;">
            YBEX <span style="color:#E4F141;">STUDIO</span>
          </div>
          <p style="color:rgba(255,255,255,0.65);font-size:0.9rem;margin-bottom:8px;">Hi ${contact.name},</p>
          <div style="background:rgba(255,255,255,0.06);border-left:3px solid #FF3D10;border-radius:8px;padding:16px 20px;margin:16px 0;color:rgba(255,255,255,0.88);font-size:0.95rem;line-height:1.75;">
            ${replyMessage.replace(/\n/g, '<br/>')}
          </div>
          <p style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:24px;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
            This is a reply to your enquiry: <em>"${contact.subject}"</em><br/>
            YBEX Studio · New Delhi, India · hello@ybex.studio
          </p>
        </div>
      `,
    });

    contact.adminReply = replyMessage;
    contact.repliedAt = new Date();
    contact.isRead = true;
    await contact.save();

    // Log activity
    await logActivity({
      req,
      action: 'UPDATE_ENQUIRY_STATUS',
      entityType: 'ENQUIRY',
      entityId: contact._id.toString(),
      entityName: contact.name,
      details: {
        subject: contact.subject,
        action: 'Replied to enquiry',
        previousStatus: originalStatus,
        newStatus: 'replied'
      }
    });

    res.json({ success: true, contact });
  } catch (e) { next(e); }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    // Soft delete
    contact.deletedAt = new Date();
    contact.deletedBy = req.user._id;
    await contact.save();

    // Log activity
    await logActivity({
      req,
      action: 'DELETE_ENQUIRY',
      entityType: 'ENQUIRY',
      entityId: req.params.id,
      entityName: contact.name,
      details: {
        subject: contact.subject,
        category: contact.category,
        email: contact.email,
        movedToBin: true
      }
    });

    res.json({ success: true, message: 'Contact moved to bin' });
  } catch (e) { next(e); }
};

// ── Users ─────────────────────────────────────────────────────────
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ deletedAt: null }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (e) { next(e); }
};

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const validRoles = ['sub-admin', 'super-admin', 'admin'];
    if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const validStatuses = ['school', 'pitch', 'sales', 'general'];
    const cleanStatus = Array.isArray(status) ? status.filter(s => validStatuses.includes(s)) : [];

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      status: cleanStatus,
      isVerified: true,
    });

    const userObj = user.toObject();
    delete userObj.password;

    // Log activity
    await logActivity({
      req,
      action: 'CREATE',
      entityType: 'USER',
      entityId: user._id.toString(),
      entityName: user.name,
      details: {
        role: user.role,
        email: user.email,
        status: user.status
      }
    });

    res.status(201).json({ success: true, user: userObj });
  } catch (e) { next(e); }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'sub-admin', 'super-admin', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Log activity
    await logActivity({
      req,
      action: 'UPDATE_USER_ROLE',
      entityType: 'USER',
      entityId: user._id.toString(),
      entityName: user.name,
      details: {
        newRole: role,
        email: user.email
      }
    });

    res.json({ success: true, user });
  } catch (e) { next(e); }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (email?.trim()) updates.email = email.trim().toLowerCase();
    if (role && ['user', 'sub-admin', 'super-admin', 'admin'].includes(role)) updates.role = role;

    // Get original user data for logging
    const originalUser = await User.findById(req.params.id).select('name email role');
    if (!originalUser) return res.status(404).json({ message: 'User not found' });

    // Check if email already exists (if changing email)
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Log activity
    await logActivity({
      req,
      action: 'UPDATE',
      entityType: 'USER',
      entityId: user._id.toString(),
      entityName: user.name,
      details: {
        originalData: {
          name: originalUser.name,
          email: originalUser.email,
          role: originalUser.role
        },
        updatedFields: updates
      }
    });

    res.json({ success: true, user });
  } catch (e) { next(e); }
};

const deleteAdminUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete yourself' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Soft delete
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    await user.save();

    // Log activity
    await logActivity({
      req,
      action: 'DELETE_USER',
      entityType: 'USER',
      entityId: req.params.id,
      entityName: user.name,
      details: {
        deletedUser: {
          name: user.name,
          email: user.email,
          role: user.role
        },
        movedToBin: true
      }
    });

    res.json({ success: true, message: 'User moved to bin' });
  } catch (e) { next(e); }
};

// ── Suggestions ───────────────────────────────────────────────────
const getAdminSuggestions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { deletedAt: null };
    if (status) filter.status = status;
    const suggestions = await Suggestion.find(filter).populate('submittedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: suggestions.length, suggestions });
  } catch (e) { next(e); }
};

const updateAdminSuggestion = async (req, res, next) => {
  try {
    const { status } = req.body;
    const originalSuggestion = await Suggestion.findById(req.params.id);
    if (!originalSuggestion) return res.status(404).json({ message: 'Suggestion not found' });

    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('submittedBy', 'name email');

    // Log activity
    await logActivity({
      req,
      action: 'UPDATE_SUGGESTION',
      entityType: 'SUGGESTION',
      entityId: suggestion._id.toString(),
      entityName: suggestion.title || 'Untitled',
      details: {
        previousStatus: originalSuggestion.status,
        newStatus: status
      }
    });

    res.json({ success: true, suggestion });
  } catch (e) { next(e); }
};

const deleteAdminSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    // Soft delete
    suggestion.deletedAt = new Date();
    suggestion.deletedBy = req.user._id;
    await suggestion.save();

    // Log activity
    await logActivity({
      req,
      action: 'DELETE_SUGGESTION',
      entityType: 'SUGGESTION',
      entityId: req.params.id,
      entityName: suggestion.title || 'Untitled',
      details: { status: suggestion.status, movedToBin: true }
    });

    res.json({ success: true, message: 'Suggestion moved to bin' });
  } catch (e) { next(e); }
};

// ── Team Members ──────────────────────────────────────────────────
const getTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, members });
  } catch (e) { next(e); }
};

const addTeamMember = async (req, res, next) => {
  try {
    const { name, role, coreTeam, socialLink, imageUrl } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const member = await TeamMember.create({
      name: name.trim(),
      role: role || '',
      coreTeam: coreTeam || 'Core Team',
      socialLink: socialLink || '',
      imageUrl: imageUrl?.trim() || null,
    });

    // Log activity
    await logActivity({
      req,
      action: 'ADD_TEAM_MEMBER',
      entityType: 'TEAM_MEMBER',
      entityId: member._id.toString(),
      entityName: member.name,
      details: { role: member.role, coreTeam: member.coreTeam }
    });

    res.status(201).json({ success: true, member });
  } catch (e) { next(e); }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Soft delete (keep image for potential restore)
    member.deletedAt = new Date();
    member.deletedBy = req.user._id;
    await member.save();

    // Log activity
    await logActivity({
      req,
      action: 'DELETE_TEAM_MEMBER',
      entityType: 'TEAM_MEMBER',
      entityId: req.params.id,
      entityName: member.name,
      details: { role: member.role, movedToBin: true }
    });

    res.json({ success: true, message: 'Member moved to bin' });
  } catch (e) { next(e); }
};

module.exports = {
  getDashboardStats,
  getAdminContacts, updateContactStatus, approveContact, rejectContact, replyContact, deleteContact,
  getAdminUsers, createAdmin, updateUserRole, updateUser, deleteAdminUser,
  getAdminSuggestions, updateAdminSuggestion, deleteAdminSuggestion,
  getTeamMembers, addTeamMember, deleteTeamMember,
};
