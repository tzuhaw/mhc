const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/event-types
// @desc    Get available event types
// @access  Private
router.get('/event-types', auth, async (req, res) => {
  try {
    const eventTypes = [
      'Yoga',
      'Meditation', 
      'Fitness Training',
      'Mental Health Workshop',
      'Nutrition Seminar',
      'Team Building',
      'Stress Management',
      'Health Screening'
    ];
    
    res.json(eventTypes);
  } catch (error) {
    console.error('Get event types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/vendors
// @desc    Get all vendors (for admin purposes)
// @access  Private
router.get('/vendors', auth, async (req, res) => {
  try {
    const vendors = await User.find({ role: 'Vendor' })
      .select('-password')
      .sort({ vendorName: 1 });
    
    res.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;