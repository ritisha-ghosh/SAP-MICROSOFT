"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { endpoints } from "../utils/api"
import "./Auth.css"

const Status = () => {
  const [apiStatus, setApiStatus] = useState("Checking...")
  const [apiUrl, setApiUrl] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const baseUrl = endpoints.auth.login.split("/auth/login")[0]
    setApiUrl(baseUrl)

    const checkApiStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/health`)
        setApiStatus("Connected")
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
          <h1 className="auth-title">System Status</h1>
          <p className="auth-subtitle">Check if the API is working</p>
        </div>

        <div className="status-content">
          <div className="status-item">
            <h3>API Status</h3>
            <div className={`status-badge ${apiStatus === "Connected" ? "status-success" : "status-error"}`}>
              {apiStatus}
            </div>
          </div>

          <div className="status-item">
            <h3>API URL</h3>
            <div className="status-value">{apiUrl}</div>
          </div>

          {error && (
            <div className="status-item">
              <h3>Error</h3>
              <div className="status-error">{error}</div>
            </div>
          )}
        </div>

        <div className="status-footer">
          <p>If the API is not connected, please check that the backend server is running and accessible.</p>
        </div>
      </div>
    </div>
  )
}

export default Status
