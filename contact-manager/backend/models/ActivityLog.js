const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    contactId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    contactName: { type: String, required: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted', 'viewed', 'favorited', 'unfavorited'],
      required: true,
    },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
