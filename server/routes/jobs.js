const express = require("express")
const auth = require("../middleware/auth")
const Job = require("../models/Job")
const { uploadToCloudinary } = require("../utils/cloudinary")
const { analyzeResume } = require("../utils/ai")
const { extractTextFromPdf } = require("../utils/pdf")

const router = express.Router()

// Get all jobs for the current user
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json({ jobs })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a specific job
router.get("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId })

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json({ job })
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new job with resumes
router.post("/", auth, async (req, res) => {
  try {
    const { title, department, location, description, requirements } = req.body

    // Create new job
    const job = new Job({
      title,
      department,
      location,
      description,
      requirements,
      user: req.userId,
    })

    // Handle job description file if provided
    if (req.files && req.files.jobDescription) {
      const jobDescFile = req.files.jobDescription
      const jobDescResult = await uploadToCloudinary(jobDescFile.tempFilePath, "job_descriptions")
      job.jobDescriptionUrl = jobDescResult.secure_url
    }

    // Handle resume files
    if (req.files && req.files.resumes) {
      const resumeFiles = Array.isArray(req.files.resumes) ? req.files.resumes : [req.files.resumes]

      // Process each resume
      for (const file of resumeFiles) {
        // Upload file to cloud storage
        const uploadResult = await uploadToCloudinary(file.tempFilePath, "resumes")

        // Extract text from PDF
        const resumeText = await extractTextFromPdf(file.tempFilePath)

        // Analyze resume with AI
        const analysis = await analyzeResume(resumeText, job.description, job.requirements)

        // Add resume to job
        job.resumes.push({
          candidateName: analysis.candidateName || "Unknown Candidate",
          email: analysis.email || "",
          phone: analysis.phone || "",
          position: analysis.position || "",
          fileUrl: uploadResult.secure_url,
          fileName: file.name,
          processed: true,
          score: analysis.score || 0,
          matchCategories: analysis.matchCategories || [],
          keySkills: analysis.keySkills || [],
          aiSummary: analysis.summary || "",
        })

        job.processedResumes += 1
      }
    }

    await job.save()

    res.status(201).json({
      message: "Job and resumes uploaded successfully",
      job,
    })
  } catch (error) {
    console.error("Create job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add resumes to an existing job
router.post("/:id/resumes", auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId })

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    if (!req.files || !req.files.resumes) {
      return res.status(400).json({ message: "No resume files uploaded" })
    }

    const resumeFiles = Array.isArray(req.files.resumes) ? req.files.resumes : [req.files.resumes]

    // Process each resume
    for (const file of resumeFiles) {
      // Upload file to cloud storage
      const uploadResult = await uploadToCloudinary(file.tempFilePath, "resumes")

      // Extract text from PDF
      const resumeText = await extractTextFromPdf(file.tempFilePath)

      // Analyze resume with AI
      const analysis = await analyzeResume(resumeText, job.description, job.requirements)

      // Add resume to job
      job.resumes.push({
        candidateName: analysis.candidateName || "Unknown Candidate",
        email: analysis.email || "",
        phone: analysis.phone || "",
        position: analysis.position || "",
        fileUrl: uploadResult.secure_url,
        fileName: file.name,
        processed: true,
        score: analysis.score || 0,
        matchCategories: analysis.matchCategories || [],
        keySkills: analysis.keySkills || [],
        aiSummary: analysis.summary || "",
      })

      job.processedResumes += 1
    }

    await job.save()

    res.json({
      message: "Resumes added successfully",
      job,
    })
  } catch (error) {
    console.error("Add resumes error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a job
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId })

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
