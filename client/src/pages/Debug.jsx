"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { endpoints } from "../utils/api"
import "./Auth.css"

const Debug = () => {
  const [apiStatus, setApiStatus] = useState("Checking...")
  const [apiResponse, setApiResponse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get(`${endpoints.auth.me.split("/auth/me")[0]}/health`)
        setApiStatus("Connected")
        setApiResponse(response.data)
      } catch (err) {
        setApiStatus("Error")
        setError(err.toString())
        console.error("API check error:", err)
      }
    }

    checkApiStatus()
  }, [])

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1 className="auth-title">API Debug</h1>
          <p className="auth-subtitle">Check API connection status</p>
        </div>

        <div className="debug-content">
          <div className="debug-item">
            <h3>API Status</h3>
            <div className={`status-badge ${apiStatus === "Connected" ? "status-success" : "status-error"}`}>
              {apiStatus}
            </div>
          </div>

          {apiResponse && (
            <div className="debug-item">
              <h3>API Response</h3>
              <pre className="response-data">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          )}

          {error && (
            <div className="debug-item">
              <h3>Error</h3>
              <pre className="error-data">{error}</pre>
            </div>
          )}

          <div className="debug-item">
            <h3>Environment</h3>
            <div className="env-info">
              <p>
                <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
              </p>
              <p>
                <strong>API Base URL:</strong> {endpoints.auth.me.split("/auth/me")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug
