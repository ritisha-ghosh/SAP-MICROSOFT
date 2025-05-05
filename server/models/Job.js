const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  position: {
    type: String,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  matchCategories: [
    {
      name: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
  keySkills: [String],
  aiSummary: String,
})

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  jobDescriptionUrl: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumes: [resumeSchema],
  processedResumes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Job = mongoose.model("Job", jobSchema)

module.exports = Job
