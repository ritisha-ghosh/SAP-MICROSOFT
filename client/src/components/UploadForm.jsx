"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import "./UploadForm.css"
import { endpoints } from "../utils/api"

const UploadForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    requirements: "",
    jobDescription: null,
    resumes: [],
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleJobDescriptionUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file for the job description")
        return
      }
      setFormData((prev) => ({ ...prev, jobDescription: file }))
    }
  }

  const handleResumeUpload = (e) => {
    const files = Array.from(e.target.files)

    // Filter for PDF files only
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== files.length) {
      toast.error("Only PDF files are accepted for resumes")
    }

    setFormData((prev) => ({
      ...prev,
      resumes: [...prev.resumes, ...pdfFiles],
    }))
  }

  const removeResume = (index) => {
    setFormData((prev) => ({
      ...prev,
      resumes: prev.resumes.filter((_, i) => i !== index),
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const pdfFiles = files.filter((file) => file.type === "application/pdf")

      if (pdfFiles.length !== files.length) {
        toast.error("Only PDF files are accepted for resumes")
      }

      setFormData((prev) => ({
        ...prev,
        resumes: [...prev.resumes, ...pdfFiles],
      }))
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.department || !formData.location) {
        toast.error("Please fill in all required fields")
        return
      }
    } else if (step === 2) {
      if (!formData.description || !formData.requirements) {
        toast.error("Please fill in all required fields")
        return
      }
    }
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.resumes.length === 0) {
      toast.error("Please upload at least one resume")
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("department", formData.department)
      formDataToSend.append("location", formData.location)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("requirements", formData.requirements)

      if (formData.jobDescription) {
        formDataToSend.append("jobDescription", formData.jobDescription)
      }

      formData.resumes.forEach((resume) => {
        formDataToSend.append("resumes", resume)
      })

      const response = await axios.post(endpoints.jobs.create, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Job and resumes uploaded successfully!")
      navigate(`/job/${response.data.job._id}`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error.response?.data?.message || "Failed to upload job and resumes")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-form-container">
      <div className="upload-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <span className="step-label">Job Details</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <span className="step-label">Job Description</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <span className="step-label">Upload Resumes</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="upload-form card">
        {step === 1 && (
          <div className="form-step">
            <h2 className="form-title">Job Details</h2>
            <p className="form-subtitle">Enter the basic information about the job position</p>

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department *
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Engineering"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Remote, New York"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2 className="form-title">Job Description</h2>
            <p className="form-subtitle">Provide detailed information about the job</p>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter a detailed description of the job..."
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="requirements" className="form-label">
                Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="form-textarea"
                placeholder="List the key requirements for this position..."
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description PDF (Optional)</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="jobDescription"
                  onChange={handleJobDescriptionUpload}
                  className="file-input"
                  accept=".pdf"
                />
                <label htmlFor="jobDescription" className="file-upload-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="upload-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>{formData.jobDescription ? formData.jobDescription.name : "Upload Job Description PDF"}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2 className="form-title">Upload Resumes</h2>
            <p className="form-subtitle">Upload candidate resumes for AI analysis</p>

            <div
              className={`resume-dropzone ${dragActive ? "active" : ""}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resumes"
                onChange={handleResumeUpload}
                className="file-input"
                accept=".pdf"
                multiple
              />
              <label htmlFor="resumes" className="dropzone-label">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="upload-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="dropzone-text">
                  <span className="dropzone-title">Drag & Drop Resumes Here</span>
                  <span className="dropzone-subtitle">or click to browse files</span>
                  <span className="dropzone-info">Only PDF files are accepted</span>
                </div>
              </label>
            </div>

            {formData.resumes.length > 0 && (
              <div className="uploaded-files">
                <h3 className="uploaded-title">Uploaded Resumes ({formData.resumes.length})</h3>
                <div className="file-list">
                  {formData.resumes.map((file, index) => (
                    <div className="file-item" key={index}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="file-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="file-name">{file.name}</span>
                      <button type="button" className="remove-file" onClick={() => removeResume(index)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="remove-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={loading}>
              Previous
            </button>
          )}

          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default UploadForm
