"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import JobCard from "../components/JobCard"
import "./Dashboard.css"
import { endpoints } from "../utils/api"

const Dashboard = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalResumes: 0,
    processedResumes: 0,
    averageScore: 0,
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(endpoints.jobs.list)
        setJobs(response.data.jobs)

        // Calculate stats
        const totalJobs = response.data.jobs.length
        const totalResumes = response.data.jobs.reduce((acc, job) => acc + job.resumes.length, 0)
        const processedResumes = response.data.jobs.reduce((acc, job) => acc + job.processedResumes, 0)

        let totalScore = 0
        let scoreCount = 0

        response.data.jobs.forEach((job) => {
          job.resumes.forEach((resume) => {
            if (resume.score) {
              totalScore += resume.score
              scoreCount++
            }
          })
        })

        const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0

        setStats({
          totalJobs,
          totalResumes,
          processedResumes,
          averageScore,
        })
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <Link to="/upload" className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="btn-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Job
        </Link>
      </div>

      <div className="stats-container">
        <div className="stat-card card">
          <div className="stat-icon">
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalJobs}</h3>
            <p className="stat-label">Total Jobs</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">
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
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalResumes}</h3>
            <p className="stat-label">Total Resumes</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.processedResumes}</h3>
            <p className="stat-label">Processed Resumes</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.averageScore}%</h3>
            <p className="stat-label">Average Match Score</p>
          </div>
        </div>
      </div>

      <div className="jobs-section">
        <h2 className="section-title">Recent Jobs</h2>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="empty-title">No Jobs Found</h3>
            <p className="empty-description">
              You haven't created any jobs yet. Start by creating a new job and uploading resumes.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Create Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
