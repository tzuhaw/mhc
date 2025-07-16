const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  proposedDates: [{
    type: Date,
    required: true
  }],
  location: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Yoga', 'Meditation', 'Fitness Training', 'Mental Health Workshop', 'Nutrition Seminar', 'Team Building', 'Stress Management', 'Health Screening']
  },
  eventName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  confirmedDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Validate that proposedDates has exactly 3 dates
eventSchema.pre('save', function(next) {
  if (this.proposedDates.length !== 3) {
    return next(new Error('Exactly 3 proposed dates are required'));
  }
  next();
});

// Validate that confirmedDate is one of the proposed dates when approved
eventSchema.pre('save', function(next) {
  if (this.status === 'Approved' && this.confirmedDate) {
    const confirmedDateStr = this.confirmedDate.toISOString().split('T')[0];
    const proposedDatesStr = this.proposedDates.map(date => date.toISOString().split('T')[0]);
    
    if (!proposedDatesStr.includes(confirmedDateStr)) {
      return next(new Error('Confirmed date must be one of the proposed dates'));
    }
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);