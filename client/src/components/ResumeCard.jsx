"use client"

import { useState } from "react"
import "./ResumeCard.css"

const ResumeCard = ({ resume, index }) => {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "high-score"
    if (score >= 60) return "medium-score"
    return "low-score"
  }

  const truncateText = (text, maxLength) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className={`resume-card card ${expanded ? "expanded" : ""}`}>
      <div className="resume-header" onClick={() => setExpanded(!expanded)}>
        <div className="resume-rank">#{index + 1}</div>
        <div className="resume-info">
          <h3 className="resume-name">{resume.candidateName}</h3>
          <p className="resume-position">{resume.position || "Not specified"}</p>
        </div>
        <div className={`resume-score ${getScoreColor(resume.score)}`}>{resume.score}%</div>
      </div>

      {expanded && (
        <div className="resume-details">
          <div className="resume-section">
            <h4 className="section-title">Contact Information</h4>
            <div className="contact-info">
              <div className="contact-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="contact-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{resume.email || "Not available"}</span>
              </div>
              {resume.phone && (
                <div className="contact-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="contact-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{resume.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="resume-section">
            <h4 className="section-title">Match Analysis</h4>
            <div className="match-categories">
              {resume.matchCategories &&
                resume.matchCategories.map((category, idx) => (
                  <div className="match-category" key={idx}>
                    <div className="category-header">
                      <span className="category-name">{category.name}</span>
                      <span className={`category-score ${getScoreColor(category.score)}`}>{category.score}%</span>
                    </div>
                    <div className="category-bar">
                      <div className="category-fill" style={{ width: `${category.score}%` }}></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {resume.keySkills && resume.keySkills.length > 0 && (
            <div className="resume-section">
              <h4 className="section-title">Key Skills</h4>
              <div className="skills-list">
                {resume.keySkills.map((skill, idx) => (
                  <div className="skill-tag" key={idx}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.aiSummary && (
            <div className="resume-section">
              <h4 className="section-title">AI Summary</h4>
              <p className="ai-summary">{resume.aiSummary}</p>
            </div>
          )}

          <div className="resume-actions">
            <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              View Resume
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
            <span className="upload-date">Uploaded on {formatDate(resume.uploadDate)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeCard
