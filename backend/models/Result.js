const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['reading', 'writing', 'speaking']
  },
  scores: {
    type: Map,
    of: Number,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  detailedAnalysis: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('Result', ResultSchema); 