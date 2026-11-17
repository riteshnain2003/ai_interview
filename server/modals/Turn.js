const mongoose = require('mongoose');

const turnSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['ai', 'candidate'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: null,
    },

   
});

module.exports = mongoose.model('Turn', turnSchema);