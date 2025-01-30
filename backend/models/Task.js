const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['reading', 'writing', 'speaking']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  timeLimit: {
    type: Number,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  questions: [{
    type: String
  }],
  criteria: {
    type: Map,
    of: Number
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema); 