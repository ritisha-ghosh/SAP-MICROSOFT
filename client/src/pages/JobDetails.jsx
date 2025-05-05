"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import ResumeCard from "../components/ResumeCard"
import "./JobDetails.css"
// Update the fetchJobDetails function to use our API utility
import { endpoints } from "../utils/api"

const JobDetails = () => {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("score")
  const [filterScore, setFilterScore] = useState(0)

  useEffect(() => {
    // In the useEffect:
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(endpoints.jobs.detail(jobId))
        setJob(response.data.job)
      } catch (error) {
        console.error("Error fetching job details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const sortResumes = (resumes) => {
    if (!resumes) return []

    const filteredResumes = resumes.filter((resume) => resume.score >= filterScore)

    return filteredResumes.sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score
      } else if (sortBy === "name") {
        return a.candidateName.localeCompare(b.candidateName)
      } else if (sortBy === "date") {
        return new Date(b.uploadDate) - new Date(a.uploadDate)
      }
      return 0
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="error-container">
        <h2>Job Not Found</h2>
        <p>The job you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const sortedResumes = sortResumes(job.resumes)

  return (
    <div className="job-details-container">
      <div className="job-details-header">
        <Link to="/" className="back-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="back-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="page-title">{job.title}</h1>
      </div>

      <div className="job-info-card card">
        <div className="job-info-header">
          <div className="job-info-main">
            <div className="job-department-location">
              <div className="job-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="job-info-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{job.department}</span>
              </div>
              <div className="job-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="job-info-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{job.location}</span>
              </div>
            </div>
            <div className="job-date">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="job-info-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Created on {formatDate(job.createdAt)}</span>
            </div>
          </div>

          <div className="job-stats">
            <div className="job-stat">
              <div className="job-stat-value">{job.resumes.length}</div>
              <div className="job-stat-label">Total Resumes</div>
            </div>
            <div className="job-stat">
              <div className="job-stat-value">{job.processedResumes}</div>
              <div className="job-stat-label">Processed</div>
            </div>
            <div className="job-stat">
              <div className="job-stat-value">
                {job.resumes.length > 0
                  ? Math.round(job.resumes.reduce((acc, resume) => acc + resume.score, 0) / job.resumes.length)
                  : 0}
                %
              </div>
              <div className="job-stat-label">Avg. Score</div>
            </div>
          </div>
        </div>

        <div className="job-description">
          <h3 className="job-section-title">Job Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-requirements">
          <h3 className="job-section-title">Requirements</h3>
          <p>{job.requirements}</p>
        </div>

        {job.jobDescriptionUrl && (
          <div className="job-actions">
            <a href={job.jobDescriptionUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              View Full Job Description
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="btn-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      <div className="resumes-section">
        <div className="resumes-header">
          <h2 className="section-title">Ranked Resumes</h2>

          <div className="resumes-filters">
            <div className="filter-group">
              <label htmlFor="sortBy" className="filter-label">
                Sort by:
              </label>
              <select id="sortBy" className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="score">Match Score</option>
                <option value="name">Name</option>
                <option value="date">Upload Date</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterScore" className="filter-label">
                Min Score:
              </label>
              <select
                id="filterScore"
                className="filter-select"
                value={filterScore}
                onChange={(e) => setFilterScore(Number(e.target.value))}
              >
                <option value="0">All Resumes</option>
                <option value="50">50% or higher</option>
                <option value="70">70% or higher</option>
                <option value="80">80% or higher</option>
              </select>
            </div>
          </div>
        </div>

        {job.resumes.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
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
            </div>
            <h3 className="empty-title">No Resumes Found</h3>
            <p className="empty-description">
              There are no resumes uploaded for this job yet. Upload resumes to start the AI screening process.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Upload Resumes
            </Link>
          </div>
        ) : sortedResumes.length === 0 ? (
          <div className="empty-state card">
            <h3 className="empty-title">No Matching Resumes</h3>
            <p className="empty-description">
              No resumes match your current filter criteria. Try adjusting the minimum score filter.
            </p>
            <button className="btn btn-secondary" onClick={() => setFilterScore(0)}>
              Show All Resumes
            </button>
          </div>
        ) : (
          <div className="resumes-list">
            {sortedResumes.map((resume, index) => (
              <ResumeCard key={resume._id} resume={resume} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetails
