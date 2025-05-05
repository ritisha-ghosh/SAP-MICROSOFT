const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const jobRoutes = require("./routes/jobs")

// Create Express app
const app = express()

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://dainty-alpaca-09f853.netlify.app", "https://ai-resume-ranker.netlify.app"]
        : "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(cookieParser())
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
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is working!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Server error",
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
