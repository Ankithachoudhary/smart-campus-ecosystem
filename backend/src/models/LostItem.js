const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['electronics', 'documents', 'accessories', 'books', 'clothing', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['lost', 'found', 'claimed', 'resolved'],
    default: 'lost'
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  images: [String],
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimDate: Date
}, {
  timestamps: true
});

lostItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('LostItem', lostItemSchema);
