const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Register a new user
router.post("/register", async (req, res) => {
  try {
    console.log("Register request received")
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    })

    await user.save()
    console.log("User saved successfully:", user._id)

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received")
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Logout user (client-side only for JWT)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" })
})

module.exports = router
