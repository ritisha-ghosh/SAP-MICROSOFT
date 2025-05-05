// API utility for consistent endpoint handling
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://ai-resume-ranker-api.onrender.com/api" : "http://localhost:5000/api"

console.log("API_BASE_URL:", API_BASE_URL)

export const endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
  },
  jobs: {
    list: `${API_BASE_URL}/jobs`,
    detail: (id) => `${API_BASE_URL}/jobs/${id}`,
    create: `${API_BASE_URL}/jobs`,
    addResumes: (id) => `${API_BASE_URL}/jobs/${id}/resumes`,
    delete: (id) => `${API_BASE_URL}/jobs/${id}`,
  },
}

// Configure axios defaults
import axios from "axios"

// Set default headers
axios.defaults.withCredentials = false // No need for cookies with JWT

// Add token from localStorage if it exists
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export default endpoints
