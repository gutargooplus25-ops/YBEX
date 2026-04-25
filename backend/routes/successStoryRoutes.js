const express = require('express');
const router = express.Router();
const SuccessStory = require('../models/SuccessStory');

// @route   GET /api/success-stories
// @desc    Get all active success stories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: stories });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/success-stories/admin
// @desc    Get all success stories (including inactive) for admin
// @access  Private (Admin)
router.get('/admin', async (req, res) => {
  try {
    const stories = await SuccessStory.find()
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: stories });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/success-stories
// @desc    Create a new success story
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const story = new SuccessStory(req.body);
    await story.save();
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    console.error('Error creating success story:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/success-stories/:id
// @desc    Update a success story
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    console.error('Error updating success story:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/success-stories/:id
// @desc    Delete a success story
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting success story:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
