import { Link } from "react-router-dom"
import "./JobCard.css"

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="job-card card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <div className="job-badge">{job.resumes.length} Resumes</div>
      </div>

      <div className="job-details">
        <div className="job-detail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="job-icon"
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
        <div className="job-detail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="job-icon"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location}</span>
        </div>
        <div className="job-detail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="job-icon"
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
          <span>Created {formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="job-progress">
        <div className="progress-label">
          <span>Screening Progress</span>
          <span>
            {job.processedResumes} / {job.resumes.length}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${job.resumes.length > 0 ? (job.processedResumes / job.resumes.length) * 100 : 0}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="job-card-footer">
        <Link to={`/job/${job._id}`} className="btn btn-primary">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="btn-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default JobCard
