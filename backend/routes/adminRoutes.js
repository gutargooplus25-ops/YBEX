const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
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
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// Contacts / Enquiries
router.get('/contacts', getAdminContacts);
router.patch('/contacts/:id', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

// Users
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteAdminUser);

// Suggestions
router.get('/suggestions', getAdminSuggestions);
router.patch('/suggestions/:id', updateAdminSuggestion);
router.delete('/suggestions/:id', deleteAdminSuggestion);

module.exports = router;
