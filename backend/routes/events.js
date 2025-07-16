const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, requireHR, requireVendor } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event (HR only)
// @access  Private (HR)
router.post('/', [auth, requireHR, [
  body('proposedDates').isArray({ min: 3, max: 3 }).withMessage('Exactly 3 proposed dates are required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('eventType').notEmpty().withMessage('Event type is required'),
  body('eventName').notEmpty().withMessage('Event name is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { proposedDates, location, eventType, eventName } = req.body;

    // Find a vendor that handles this event type
    const vendor = await User.findOne({ 
      role: 'Vendor', 
      eventTypes: eventType 
    });

    const event = new Event({
      companyName: req.user.companyName,
      proposedDates: proposedDates.map(date => new Date(date)),
      location,
      eventType,
      eventName,
      createdBy: req.user._id,
      assignedVendor: vendor ? vendor._id : null
    });

    await event.save();
    await event.populate('assignedVendor', 'vendorName');

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events
// @desc    Get events based on user role
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let events;

    if (req.user.role === 'HR') {
      // HR can only see events from their company
      events = await Event.find({ 
        companyName: req.user.companyName 
      }).populate('assignedVendor', 'vendorName').sort({ createdAt: -1 });
    } else if (req.user.role === 'Vendor') {
      // Vendor can only see events assigned to them
      events = await Event.find({ 
        assignedVendor: req.user._id 
      }).populate('createdBy', 'companyName').sort({ createdAt: -1 });
    }

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('assignedVendor', 'vendorName')
      .populate('createdBy', 'companyName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check access permissions
    if (req.user.role === 'HR' && event.companyName !== req.user.companyName) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'Vendor' && !event.assignedVendor?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id/approve
// @desc    Approve event and set confirmed date (Vendor only)
// @access  Private (Vendor)
router.put('/:id/approve', [auth, requireVendor, [
  body('confirmedDate').notEmpty().withMessage('Confirmed date is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { confirmedDate } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if vendor is assigned to this event
    if (!event.assignedVendor?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if event is still pending
    if (event.status !== 'Pending') {
      return res.status(400).json({ message: 'Event has already been processed' });
    }

    event.status = 'Approved';
    event.confirmedDate = new Date(confirmedDate);
    event.remarks = '';

    await event.save();
    await event.populate('assignedVendor', 'vendorName');

    res.json(event);
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id/reject
// @desc    Reject event with remarks (Vendor only)
// @access  Private (Vendor)
router.put('/:id/reject', [auth, requireVendor, [
  body('remarks').notEmpty().withMessage('Rejection reason is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { remarks } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if vendor is assigned to this event
    if (!event.assignedVendor?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if event is still pending
    if (event.status !== 'Pending') {
      return res.status(400).json({ message: 'Event has already been processed' });
    }

    event.status = 'Rejected';
    event.remarks = remarks;
    event.confirmedDate = null;

    await event.save();
    await event.populate('assignedVendor', 'vendorName');

    res.json(event);
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;