const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, trim: true, lowercase: true, default: '' },
    phone:       { type: String, trim: true, default: '' },
    company:     { type: String, trim: true, default: '' },
    role:        { type: String, trim: true, default: '' },
    address:     { type: String, trim: true, default: '' },
    notes:       { type: String, default: '' },
    tags:        [{ type: String }],
    favorite:    { type: Boolean, default: false },
    avatarColor: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
