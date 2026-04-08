const express = require('express');
const {
  createSuggestion,
  getAllSuggestions,
  updateSuggestionStatus,
  deleteSuggestion,
} = require('../controllers/suggestionController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', createSuggestion);
router.get('/', protect, adminOnly, getAllSuggestions);
router.patch('/:id', protect, adminOnly, updateSuggestionStatus);
router.delete('/:id', protect, adminOnly, deleteSuggestion);

module.exports = router;
