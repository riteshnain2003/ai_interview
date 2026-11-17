const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      default: 'Candidate',
    },
    targetRole: {
      type: String,
      default: 'Full-Stack Developer',
    },
    seniority: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    difficulty: {
      type: String,
      required: true,
    },
    persona: {
      type: String,
      default: 'Strict Tech Lead',
    },
    resumeText: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      default: null,
    },
    // Array of ObjectIds referencing the Turn collection
    turns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turn',
      },
    ],
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    reports: [
      {
        overallScore: Number,
        summary: String,
        strengths: [String],
        areasForImprovement: [String],
        breakdown: [
          {
            question: String,
            score: Number,
            feedback: String,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);