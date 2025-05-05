"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { endpoints } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(endpoints.auth.me)
        setUser(response.data.user)
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear token if invalid
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await axios.post(endpoints.auth.login, { email, password })

      // Save token to localStorage and state
      const newToken = response.data.token
      localStorage.setItem("token", newToken)
      setToken(newToken)

      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(endpoints.auth.register, { name, email, password })

      // Save token to localStorage and state
      const newToken = response.data.token
      localStorage.setItem("token", newToken)
      setToken(newToken)

      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error)
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post(endpoints.auth.logout)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear local state regardless of server response
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
