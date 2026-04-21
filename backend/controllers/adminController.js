const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Suggestion = require('../models/Suggestion');
const TeamMember = require('../models/TeamMember');
const Influencer = require('../models/Influencer');
const sendEmail = require('../utils/sendEmail');

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
    res.json({ success: true, contact });
  } catch (e) { next(e); }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (e) { next(e); }
};

// ── Users ─────────────────────────────────────────────────────────
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (e) { next(e); }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

const deleteAdminUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete yourself' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (e) { next(e); }
};

// ── Suggestions ───────────────────────────────────────────────────
const getAdminSuggestions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const suggestions = await Suggestion.find(filter).populate('submittedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: suggestions.length, suggestions });
  } catch (e) { next(e); }
};

const updateAdminSuggestion = async (req, res, next) => {
  try {
    const { status } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('submittedBy', 'name email');
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ success: true, suggestion });
  } catch (e) { next(e); }
};

const deleteAdminSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ success: true, message: 'Suggestion deleted' });
  } catch (e) { next(e); }
};

// ── Team Members ──────────────────────────────────────────────────
const getTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
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
    res.status(201).json({ success: true, member });
  } catch (e) { next(e); }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.imageUrl && member.imageUrl.startsWith('/uploads/')) {
      const fp = path.join(__dirname, '..', member.imageUrl);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ success: true, message: 'Member deleted' });
  } catch (e) { next(e); }
};

module.exports = {
  getDashboardStats,
  getAdminContacts, updateContactStatus, approveContact, rejectContact, replyContact, deleteContact,
  getAdminUsers, updateUserRole, deleteAdminUser,
  getAdminSuggestions, updateAdminSuggestion, deleteAdminSuggestion,
  getTeamMembers, addTeamMember, deleteTeamMember,
};
