const Suggestion = require('../models/Suggestion');

// @desc    Create suggestion
// @route   POST /api/suggestions
const createSuggestion = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const suggestion = await Suggestion.create({
      title,
      description,
      category,
      submittedBy: req.user?._id,
    });
    res.status(201).json({ success: true, suggestion });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all suggestions
// @route   GET /api/suggestions
const getAllSuggestions = async (req, res, next) => {
  try {
    const suggestions = await Suggestion.find().populate('submittedBy', 'name email');
    res.json({ success: true, count: suggestions.length, suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update suggestion status (admin)
// @route   PATCH /api/suggestions/:id
const updateSuggestionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ success: true, suggestion });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete suggestion
// @route   DELETE /api/suggestions/:id
const deleteSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ success: true, message: 'Suggestion deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSuggestion, getAllSuggestions, updateSuggestionStatus, deleteSuggestion };
