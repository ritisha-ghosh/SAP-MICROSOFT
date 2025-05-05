const express = require("express")
const serverless = require("serverless-http")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const path = require("path")
const fileUpload = require("express-fileupload")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("../../server/routes/auth")
const jobRoutes = require("../../server/routes/jobs")

// Create Express app
const app = express()
const router = express.Router()

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins in serverless function
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(cookieParser())

// For file uploads in serverless environment
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  }),
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API routes
router.use("/auth", authRoutes)
router.use("/jobs", jobRoutes)

// Debug route to check if API is working
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is working!" })
})

app.use("/.netlify/functions/api", router)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Server error",
  })
})

// Export the serverless function
module.exports.handler = serverless(app)
